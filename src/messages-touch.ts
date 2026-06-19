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

document.addEventListener('click', (e) => {
    if (ignoreNextClick) {
        e.stopPropagation();
        e.preventDefault();
        ignoreNextClick = false;
    }
}, true);

(window as any).handleMessageTouchStart = (e: TouchEvent | MouseEvent, msgId: string) => {
    touchTarget = msgId;
    if (window.TouchEvent && e instanceof TouchEvent) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    } else {
        touchStartX = (e as MouseEvent).clientX;
        touchStartY = (e as MouseEvent).clientY;
    }
    touchTimer = setTimeout(() => {
        if (touchTarget === msgId) {
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
        const el = document.getElementById(`msg-${touchTarget}`);
        if (el) {
            const transform = el.style.transform;
            if (transform && transform.includes('translateX')) {
                const match = transform.match(/translateX\(-(\d+(?:\.\d+)?)px\)/);
                if (match && parseFloat(match[1]) > 40) {
                    const replyContent = decodeURIComponent(el.getAttribute('data-reply-content') || '');
                    const senderName = decodeURIComponent(el.getAttribute('data-sender-name') || '');
                    import('./messages-actions').then(m => m.replyToMessage(touchTarget!, replyContent, senderName));
                    if (navigator.vibrate) {
                        try { navigator.vibrate(25); } catch(err){}
                    }
                }
                el.style.transition = 'transform 0.2s ease-out';
                el.style.transform = '';
                setTimeout(() => el.style.transition = '', 200);
            }
        }
    }
    touchTarget = null;
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
    
    if (Math.abs(currentX - touchStartX) > 10 || Math.abs(currentY - touchStartY) > 10) {
        clearTimeout(touchTimer);
        // Only clear target if we are not swiping left to reply
        if (touchStartX - currentX < 10 || Math.abs(currentY - touchStartY) > 30) {
            touchTarget = null;
        }
    }
    
    if (touchTarget) {
        const diffX = touchStartX - currentX;
        const diffY = Math.abs(currentY - touchStartY);
        if (diffY < 30 && diffX > 0) {
            const el = document.getElementById(`msg-${touchTarget}`);
            if (el) {
                const move = Math.min(diffX, 50);
                el.style.transform = `translateX(-${move}px)`;
            }
        }
    }
};



