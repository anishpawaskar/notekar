import { useRef, useState } from 'react';
import { NoteFormModalButton } from './ModalButton';
import { NoteFormPresentation } from './Presentation';
import { useAddNewNoteMutation } from '../../app/services/api';
import { NOTES_FORM_ACTIONS } from '../NotesActions/NotesActionsConstants';

export const NoteForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [isColorPaletteVisible, setIsColorPaletteVisible] = useState(false);
  const [bgColor, setBgColor] = useState('#fff');
  const [hoverBackgroundColor, setHoverBackgroundColor] = useState('#e0e0e0');

  const [addNewNote] = useAddNewNoteMutation();

  const noteFormModalButtonRef = useRef(null);
  const noteFormTitleRef = useRef(null);
  const noteFormDescriptionRef = useRef(null);
  const isNoteArchived = useRef(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openModalOnInput = (e) => {
    if (e.target.value !== '') {
      setIsModalOpen(true);
      setDescription(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const saveNote = async () => {
    const title = noteFormTitleRef.current.value;
    try {
      if (title || description) {
        await addNewNote({
          title,
          description,
          theme: {
            backgroundColor: bgColor,
            hoverBackgroundColor: hoverBackgroundColor,
          },
          states: { isArchived: isNoteArchived.current },
        }).unwrap();
        noteFormTitleRef.current.value = '';
        setDescription('');
        noteFormDescriptionRef.current.value = '';
        setBgColor('#fff');
        setHoverBackgroundColor('#e0e0e0');
        setIsColorPaletteVisible(false);
        setIsModalOpen(false);
      }
      setBgColor('#fff');
      setHoverBackgroundColor('#e0e0e0');
      setIsModalOpen(false);
      setIsColorPaletteVisible(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      noteFormDescriptionRef.current.focus();
    }
  };

  const handleActions = async (e, action) => {
    switch (action) {
      case 'archive': {
        if (title || description) {
          isNoteArchived.current = true;
          await saveNote();
          break;
        }
      }

      case 'changeBackground': {
        setIsColorPaletteVisible(true);
        break;
      }
    }
  };

  const closeColorPalette = () => {
    setIsColorPaletteVisible(false);
  };

  const colorHandler = (color, hoverBgColor) => {
    setBgColor(color);
    setHoverBackgroundColor(hoverBgColor);
  };

  if (!isModalOpen) {
    return (
      <NoteFormModalButton
        noteFormModalButtonRef={noteFormModalButtonRef}
        openModal={openModal}
        openModalOnInput={openModalOnInput}
      />
    );
  }

  return (
    <NoteFormPresentation
      handleDescriptionChange={handleDescriptionChange}
      saveNote={saveNote}
      description={description}
      noteFormTitleRef={noteFormTitleRef}
      noteFormDescriptionRef={noteFormDescriptionRef}
      handleKeyDown={handleKeyDown}
      notesActions={NOTES_FORM_ACTIONS}
      handleActions={handleActions}
      isColorPaletteVisible={isColorPaletteVisible}
      closeColorPalette={closeColorPalette}
      bgColor={bgColor}
      hoverBackgroundColor={hoverBackgroundColor}
      colorHandler={colorHandler}
    />
  );
};
