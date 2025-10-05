import { useState, createElement } from 'react';
import { DesktopCallModal } from '@/components/DesktopCallModal';

// Simple check for mobile devices
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const usePhoneCall = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const triggerCall = (number: string) => {
    if (isMobile) {
      window.location.href = `tel:${number}`;
    } else {
      setPhoneNumber(number);
      setIsModalOpen(true);
    }
  };

  // A component to be rendered at the root of the page using the hook
  const CallModal = () => {
    return createElement(DesktopCallModal, {
      open: isModalOpen,
      onOpenChange: setIsModalOpen,
      phoneNumber: phoneNumber,
    });
  };

  return { triggerCall, CallModal };
};
