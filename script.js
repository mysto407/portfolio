gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.normalizeScroll(true);

const ORIGINAL_ITEM_CSS_HEIGHT = 846;
const ORIGINAL_COLUMN_CSS_WIDTH = 630;

const ROW_GAP = 10;
const NUM_EXTRA_COLUMNS_LEFT = 1;
const HIDE_BUFFER = 100;

const FINAL_CONTENT_HOLD_DURATION_PX = 0;
const MAX_TEXT_FONT_SIZE = 30;

// Scramble text effect
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

function scrambleText(element, progress) {
    const originalText = element.getAttribute('data-original-text') || element.textContent;
    if (!element.getAttribute('data-original-text')) {
        element.setAttribute('data-original-text', originalText);
    }

    const length = originalText.length;
    let scrambled = '';

    const unscrambleProgress = Math.max(0, Math.min(1, progress));
    const revealedChars = Math.floor(length * unscrambleProgress);

    for (let i = 0; i < length; i++) {
        if (i < revealedChars) {
            scrambled += originalText[i];
        } else if (originalText[i] === ' ') {
            scrambled += ' ';
        } else {
            scrambled += chars[Math.floor(Math.random() * chars.length)];
        }
    }

    element.textContent = scrambled;
}

function setupAnimations() {
    const container = document.querySelector(".container");
    const wrapper = document.querySelector(".columns-wrapper");
    const columns = gsap.utils.toArray(".column", wrapper);
    const allItems = gsap.utils.toArray(".item", wrapper);
    const scrollIndicatorCircle = document.querySelector(".scroll-indicator-circle");

    if (!container || !wrapper || columns.length === 0 || allItems.length === 0 || !scrollIndicatorCircle) {
        console.warn("GSAP Scroll Animation: Essential elements not found. Skipping setup.");
        return;
    }

    gsap.set(allItems, {
        scale: 1
    });
    gsap.set(scrollIndicatorCircle, {
        opacity: 0,
        scale: 0
    });

    const allTextElements = gsap.utils.toArray(".item-text", wrapper);
    gsap.set(allTextElements, {
        fontSize: "0px",
        opacity: 0
    });

    // Initialize scrambled text
    allTextElements.forEach(textEl => {
        textEl.setAttribute('data-original-text', textEl.textContent);
        scrambleText(textEl, 0);
    });

    const itemCssAspectRatio = ORIGINAL_COLUMN_CSS_WIDTH / ORIGINAL_ITEM_CSS_HEIGHT;
    document.documentElement.style.setProperty('--item-aspect-ratio', itemCssAspectRatio);

    const pagePadding = 20;
    let columnsWrapperEffectiveLeft = pagePadding;

    const containerWrapperPadding = 20;
    const columnMarginRightOriginal = 10;
    const numTargetColumnsToDisplay = 3;

    const availableWidthForColumnsArea = window.innerWidth - (2 * containerWrapperPadding);

    let newColumnWidth = (availableWidthForColumnsArea - ((numTargetColumnsToDisplay - 1) * columnMarginRightOriginal)) / numTargetColumnsToDisplay;
    newColumnWidth = Math.max(newColumnWidth, 50);

    const calculatedNewItemHeight = newColumnWidth * (ORIGINAL_ITEM_CSS_HEIGHT / ORIGINAL_COLUMN_CSS_WIDTH);

    gsap.set(columns, {
        width: newColumnWidth
    });
    gsap.set(allItems, {
        height: calculatedNewItemHeight
    });

    const effectiveItemHeight = calculatedNewItemHeight;
    const itemTotalSpace = effectiveItemHeight + ROW_GAP;

    const itemsToScrollPastCol1 = 3;
    const itemsToScrollPastCol2 = 4;
    const itemsToScrollPastCol3 = 5;

    const maxItemsToScrollPastForAlignment = Math.max(itemsToScrollPastCol1, itemsToScrollPastCol2, itemsToScrollPastCol3);

    const originalScrollDistanceForColumnsMovement = maxItemsToScrollPastForAlignment * itemTotalSpace;
    const columnsClearScrollDistance = originalScrollDistanceForColumnsMovement + effectiveItemHeight + HIDE_BUFFER;

    const SPLIT_SECTION_SCROLL_DISTANCE = 600;

    const originalYTranslations = [
        itemsToScrollPastCol1 * itemTotalSpace,
        itemsToScrollPastCol2 * itemTotalSpace,
        itemsToScrollPastCol3 * itemTotalSpace,
        (itemsToScrollPastCol3 * itemTotalSpace) * 1.1
    ];
    const finalYTranslationsForColumns = originalYTranslations.map(y => y + effectiveItemHeight + HIDE_BUFFER);

    const totalPinDuration = columnsClearScrollDistance + SPLIT_SECTION_SCROLL_DISTANCE + FINAL_CONTENT_HOLD_DURATION_PX;

    const columnActualWidth = newColumnWidth;
    const columnOuterWidth = columnActualWidth + columnMarginRightOriginal;

    columns.forEach(col => {
        const itemsInColumn = gsap.utils.toArray(".item", col);
        itemsInColumn.forEach((item, index) => {
            gsap.set(item, {
                y: index * itemTotalSpace
            });
        });
    });

    const initialWrapperX = -(NUM_EXTRA_COLUMNS_LEFT * columnOuterWidth);
    gsap.set(wrapper, {
        x: initialWrapperX + (columnsWrapperEffectiveLeft - pagePadding),
        width: columns.length * columnOuterWidth - columnMarginRightOriginal
    });

    const columnIndividualXShift = newColumnWidth * 0.6;
    const wrapperXTarget = initialWrapperX + (columnsWrapperEffectiveLeft - pagePadding) + (NUM_EXTRA_COLUMNS_LEFT * columnOuterWidth);

    const masterTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: ".container",
            start: "top top",
            end: () => `+=${totalPinDuration}`,
            scrub: true,
            pin: true,
            pinType: "transform",
            invalidateOnRefresh: true,
            onRefresh: (self) => {
                if (self.pin) {
                    gsap.set(self.pin, {
                        width: "100vw",
                        maxWidth: "100vw"
                    });
                }
            },
            onUpdate: (self) => {
                // Update scramble effect for all text elements based on their individual positions
                allTextElements.forEach(textEl => {
                    const textBounds = textEl.getBoundingClientRect();
                    const viewportHeight = window.innerHeight;

                    const textCenter = textBounds.top + (textBounds.height / 2);
                    const textPositionPercent = (textCenter / viewportHeight) * 100;

                    let scrambleProgress = 0;

                    if (textPositionPercent <= 15) {
                        scrambleProgress = 0;
                    } else if (textPositionPercent > 15 && textPositionPercent <= 20) {
                        scrambleProgress = (textPositionPercent - 15) / 5;
                    } else if (textPositionPercent > 20 && textPositionPercent <= 60) {
                        scrambleProgress = 1;
                    } else if (textPositionPercent > 60 && textPositionPercent <= 65) {
                        scrambleProgress = 1 - ((textPositionPercent - 60) / 5);
                    } else {
                        scrambleProgress = 0;
                    }

                    scrambleText(textEl, scrambleProgress);
                });
            }
        }
    });

    columns.forEach((col, index) => {
        const itemsInColumn = gsap.utils.toArray(".item", col);
        const textsInColumn = gsap.utils.toArray(".item-text", col);

        const yTranslateAmount = (index < finalYTranslationsForColumns.length) ?
            finalYTranslationsForColumns[index] :
            (maxItemsToScrollPastForAlignment * itemTotalSpace) + effectiveItemHeight + HIDE_BUFFER;
        if (itemsInColumn.length > 0) {
            masterTimeline.to(itemsInColumn, {
                y: `-=${yTranslateAmount}`,
                ease: "none"
            }, 0);

            masterTimeline.to(itemsInColumn, {
                keyframes: {
                    "0%": {
                        scale: 1
                    },
                    "50%": {
                        scale: 0.90
                    },
                    "100%": {
                        scale: 0
                    },
                    easeEach: "power1.inOut"
                }
            }, 0);

            if (textsInColumn.length > 0) {
                masterTimeline.to(textsInColumn, {
                    keyframes: {
                        "0%": {
                            fontSize: "0px",
                            opacity: 0
                        },
                        "50%": {
                            fontSize: `${MAX_TEXT_FONT_SIZE}px`,
                            opacity: 1
                        },
                        "100%": {
                            fontSize: "100px",
                            opacity: 0.2
                        },
                        easeEach: "power1.inOut"
                    }
                }, 0);
            }
        }
    });

    masterTimeline.to(columns, {
        x: `+=${columnIndividualXShift}`,
        ease: "none"
    }, 0);
    masterTimeline.to(wrapper, {
        x: wrapperXTarget,
        ease: "none"
    }, 0);

    masterTimeline.addLabel("mainScrollAnimationsComplete", ">");

    // Circle and split animation
    const splitTop = document.querySelector(".split-top");
    const splitBottom = document.querySelector(".split-bottom");
    const splitContent = document.querySelector(".split-content");

    masterTimeline.to(scrollIndicatorCircle, {
        opacity: 1,
        scale: 1.5,
        duration: 0.5,
        ease: "power2.out"
    }, "mainScrollAnimationsComplete-=0.1");

    masterTimeline.to([splitTop, splitBottom], {
        scaleY: 1,
        duration: 0.8,
        ease: "power2.inOut"
    }, "mainScrollAnimationsComplete-=0.1");

    masterTimeline.to(splitContent, {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
    }, "mainScrollAnimationsComplete+=0.5");

    // Animate the sliding digit, text changes, and image transitions
    const slidingDigits = document.querySelector('.number-sliding-digits');
    const contentTitle = document.querySelector('.content-large-title');
    const contentSummary = document.querySelector('.content-summary');
    const contentDescription = document.querySelector('.content-description');
    const imagePlaceholder = document.querySelector('.image-placeholder');
    const originalImage = document.querySelector('.image-placeholder img');

    if (slidingDigits && imagePlaceholder && originalImage) {
        // Create sliding image structure similar to sliding numbers
        const imageSlideContainer = document.createElement('div');
        imageSlideContainer.className = 'image-sliding-container';

        const imageSlidingImages = document.createElement('div');
        imageSlidingImages.className = 'image-sliding-images';

        // Define text and image content for each stage
        const textStages = {
            stage1: {
                title: "Grand Himalayan Adventure",
                summary: "This is a short summary for the first item. It provides a brief overview.",
                description: "Discover the breathtaking landscapes and rich cultural heritage of the Himalayas. This tour package offers an unforgettable journey through majestic mountains, serene monasteries, and vibrant local communities. Experience the adventure of a lifetime.",
                image: "1.jpg"
            },
            stage2: {
                title: "Sacred Temple Journey",
                summary: "Explore ancient temples and spiritual sites across the mystical kingdom.",
                description: "Immerse yourself in the spiritual heart of Bhutan. Visit sacred monasteries perched on cliff faces, witness colorful prayer flags fluttering in mountain winds, and participate in traditional ceremonies that have remained unchanged for centuries.",
                image: "2.jpg"
            },
            stage3: {
                title: "Cultural Heritage Explorer",
                summary: "Experience authentic Bhutanese culture through festivals and traditions.",
                description: "Journey through time-honored villages where traditional ways of life flourish. Attend vibrant mask dances, learn ancient crafts from local artisans, and share meals with farming families who embody the spirit of Gross National Happiness.",
                image: "3.jpg"
            }
        };

        // Create image elements for sliding
        Object.values(textStages).forEach((stage, index) => {
            const slideImage = document.createElement('img');
            slideImage.src = stage.image;
            slideImage.alt = `Stage ${index + 1} Image`;
            slideImage.className = 'sliding-image';
            imageSlidingImages.appendChild(slideImage);
        });

        // Replace original image with sliding structure
        originalImage.remove();
        imageSlideContainer.appendChild(imageSlidingImages);
        imagePlaceholder.appendChild(imageSlideContainer);

        // Add CSS styles for sliding images
        const imageSlideStyles = document.createElement('style');
        imageSlideStyles.textContent = `
            .image-sliding-container {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            
            .image-sliding-images {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                transition: none;
            }
            
            .sliding-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
                flex-shrink: 0;
            }
        `;
        document.head.appendChild(imageSlideStyles);

        // Track current stage
        let currentStage = 1;

        // Function to update content based on stage
        const updateContent = (stage) => {
            if (stage === currentStage) return;

            const stageData = textStages[`stage${stage}`];

            // Animate sliding digit
            const digitYPosition = -(stage - 1) * 33; // 0%, -100%, -200%
            gsap.to(slidingDigits, {
                y: `${digitYPosition}%`,
                duration: 0.5,
                ease: "power2.inOut"
            });

            // Animate sliding image - similar to number sliding
            const imageYPosition = -(stage - 1) * 100; // 0%, -100%, -200%
            gsap.to(imageSlidingImages, {
                y: `${imageYPosition}%`,
                duration: 0.5,
                ease: "power2.inOut"
            });

            // Store current dimensions to prevent layout shifts
            const titleHeight = contentTitle.offsetHeight;
            const summaryHeight = contentSummary.offsetHeight;
            const descriptionHeight = contentDescription.offsetHeight;

            // Set fixed heights during animation
            contentTitle.style.height = titleHeight + 'px';
            contentSummary.style.height = summaryHeight + 'px';
            contentDescription.style.height = descriptionHeight + 'px';

            // Scramble text elements
            scrambleText(contentTitle, 0);
            scrambleText(contentSummary, 0);
            scrambleText(contentDescription, 0);

            // Update texts
            contentTitle.setAttribute('data-original-text', stageData.title);
            contentSummary.setAttribute('data-original-text', stageData.summary);
            contentDescription.setAttribute('data-original-text', stageData.description);

            // Unscramble to new text
            gsap.to({}, {
                duration: 0.5,
                onUpdate: function() {
                    const progress = this.progress();
                    scrambleText(contentTitle, progress);
                    scrambleText(contentSummary, progress);
                    scrambleText(contentDescription, progress);
                }
            });

            currentStage = stage;
        };

        // Create stage timeline
        const stageTimeline = gsap.timeline();
        stageTimeline.to({}, {
            duration: 1,
            onUpdate: function() {
                const progress = this.progress();
                if (progress < 0.33) {
                    updateContent(1);
                } else if (progress < 0.67) {
                    updateContent(2);
                } else {
                    updateContent(3);
                }
            }
        });

        // Add the stage timeline to the master timeline
        masterTimeline.add(stageTimeline, "mainScrollAnimationsComplete+=0.8");
    }

    // Make split section interactive after animation
    masterTimeline.set(".split-section", {
        pointerEvents: "auto"
    }, "mainScrollAnimationsComplete+=1");
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(setupAnimations, 100);

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.getAll().forEach(st => st.kill(true));
            const elementsToReset = [
                ".container", ".columns-wrapper", ".column", ".item",
                ".item-image-wrapper", ".item img",
                ".scroll-indicator-circle", ".item-text",
                ".split-section", ".split-top", ".split-bottom", ".split-content"
            ];
            gsap.killTweensOf(elementsToReset.join(", "));
            document.querySelectorAll(elementsToReset.join(", ")).forEach(el => {
                gsap.set(el, {
                    clearProps: "all"
                });
                if (el.classList.contains('item-text') && el.hasAttribute('data-original-text')) {
                    el.textContent = el.getAttribute('data-original-text');
                    el.removeAttribute('data-original-text');
                }
            });
            setTimeout(() => {
                setupAnimations();
                ScrollTrigger.refresh();
            }, 100);
        }, 250);
    });
});