import { supabase, state } from './supabase';
import { scrollToBottom, customAlert, customConfirm, customPrompt, closeModal, customToast } from './utils';
import { isSelectionMode, toggleSelectionMode, toggleMessageSelection, deleteSelectedMessages, forwardSelectedMessages, confirmForwardMultiple, selectedMessages } from './selection';
import { openLightbox, closeLightbox, lightboxNext, lightboxPrev } from './lightbox';
import { toggleReactionMenu, toggleReaction, toggleMessageMenu, toggleEmojiMenu, sendEmojiMessage, getNotoEmojiUrl, closeAllMessageMenus, adjustMenuPosition, generateReactionsHtml } from './reactions';

let touchTimer: any;
let ignoreNextClick = false;
(window as any).setIgnoreNextClick = (val: boolean) => { ignoreNextClick = val; };
let touchTarget: string | null = null;
let touchStartX = 0;
let touchStartY = 0;
let isSwiping = false;
let currentTranslateX = 0;

document.addEventListener('click', (e) => {
    if (ignoreNextClick) {
        e.stopPropagation();
        e.preventDefault();
        ignoreNextClick = false;
    }
}, true);

(window as any).handleMessageTouchStart = (e: TouchEvent | MouseEvent, msgId: string) => {
    touchTarget = msgId;
    isSwiping = false;
    currentTranslateX = 0;
    
    if (window.TouchEvent && e instanceof TouchEvent) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    } else {
        touchStartX = (e as MouseEvent).clientX;
        touchStartY = (e as MouseEvent).clientY;
    }
    
    const wrapper = document.getElementById(`msg-wrapper-${msgId}`);
    if (wrapper) {
        wrapper.style.transition = 'none';
    }

    touchTimer = setTimeout(() => {
        if (touchTarget === msgId && !isSwiping) {
            ignoreNextClick = true;
            (window as any).toggleReactionMenu(e, msgId);
            if (navigator.vibrate) {
                try { navigator.vibrate(50); } catch(e){}
            }
            touchTarget = null;
        }
    }, 500);
};

(window as any).handleMessageTouchEnd = (e: TouchEvent | MouseEvent) => {
    clearTimeout(touchTimer);
    
    if (touchTarget) {
        const wrapper = document.getElementById(`msg-wrapper-${touchTarget}`);
        
        if (isSwiping && currentTranslateX < -40) {
            // Trigger reply
            const innerElement = document.getElementById(`msg-${touchTarget}`);
            if (innerElement) {
                const encodedContent = innerElement.getAttribute('data-reply-content') || '';
                const encodedSender = innerElement.getAttribute('data-reply-sender') || '';
                if (navigator.vibrate) {
                    try { navigator.vibrate(10); } catch(e){}
                }
                import('./messages-actions').then(m => m.replyToMessage(touchTarget!, decodeURIComponent(encodedContent), decodeURIComponent(encodedSender)));
            }
            ignoreNextClick = true;
        }
        
        if (wrapper) {
            wrapper.style.transition = 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)';
            wrapper.style.transform = 'translateX(0px)';
            
            setTimeout(() => {
                wrapper.style.transition = '';
                wrapper.style.transform = '';
            }, 300);
        }
    }
    
    touchTarget = null;
    isSwiping = false;
    
    if (ignoreNextClick) {
        setTimeout(() => { ignoreNextClick = false; }, 300);
    }
};

(window as any).handleMessageTouchMove = (e: TouchEvent | MouseEvent) => {
    if (!touchTarget) return;
    let currentX = 0;
    let currentY = 0;
    if (window.TouchEvent && e instanceof TouchEvent) {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
    } else {
        currentX = (e as MouseEvent).clientX;
        currentY = (e as MouseEvent).clientY;
    }
    
    const deltaX = currentX - touchStartX;
    const deltaY = currentY - touchStartY;
    
    if (!isSwiping) {
        if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
            isSwiping = true;
            clearTimeout(touchTimer);
        } else if (Math.abs(deltaY) > 10) {
            clearTimeout(touchTimer);
            touchTarget = null;
            return;
        }
    }
    
    if (isSwiping) {
        // Only allow swiping left (negative deltaX)
        if (deltaX > 0) {
            currentTranslateX = 0;
        } else {
            // Add resistance
            currentTranslateX = deltaX * 0.4;
            // Cap it at -60px
            if (currentTranslateX < -60) {
                currentTranslateX = -60 - Math.log(-currentTranslateX - 59) * 5;
            }
        }
        
        const wrapper = document.getElementById(`msg-wrapper-${touchTarget}`);
        if (wrapper) {
            wrapper.style.transform = `translateX(${currentTranslateX}px)`;
        }
    }
};



