import React, { useState } from 'react';
import AISearchModal from './AISearchModal';

const AISearchButton = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    function toggleModal() {
        setIsModalOpen(!isModalOpen);
    }

    function handleInputChange(event) {
        setInputValue(event.target.value);
    }

  return (
            <div className='search-link'>
                <button className='custom-doc-Search-bar hideSearchButtons' onClick={toggleModal}>Ask Shesha AI</button>
                <AISearchModal
                    show={isModalOpen}
                    closeModal={toggleModal}
                />
            </div>
  )
}

export default AISearchButton