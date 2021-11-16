import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
};

const Modal = ({ children, isOpen }: ModalProps) => {
  const [isBrowser, setIsBrowser] = useState<boolean>(false);
  const [modalRoot, setModalRoot] = useState<Element | null>();

  useEffect(() => {
    setIsBrowser(true);
    setModalRoot(document.getElementById('modal-root'));
  }, []);


  const modalContent = (
    <ModalOverlay>
      {children}
    </ModalOverlay>
  );

  return isBrowser && isOpen ? createPortal(modalContent, modalRoot as Element) : null;
};

export default Modal;

const ModalOverlay = styled.div`
  background: rgba(139, 139, 139, 0.49) 0% 0% no-repeat padding-box;
  
  border: 1px solid #707070;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  justify-content: center;
  align-items: center;

`;