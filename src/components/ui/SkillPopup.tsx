import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import styles from '../../styles/SkillPopup.module.css';
import { useLanguage } from '../../context/LanguageContext';
import type { SkillData } from '../../data/skills';

interface SkillPopupProps {
  skill: SkillData;
  onClose: () => void;
}

const SkillPopup: React.FC<SkillPopupProps> = ({ skill, onClose }) => {
  const { locale } = useLanguage();
  const isSpanish = locale === 'es';

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const popupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: '-50%',
      x: '-50%',
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: '-50%',
      x: '-50%',
    },
  };

  const experienceLabel = isSpanish ? 'Experiencia' : 'Experience';
  const closeLabel = isSpanish ? 'Cerrar' : 'Close';

  const popupContent = (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={backdropVariants}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        className={styles.backdrop}
      />
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={popupVariants}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={styles.popupContainer}
      >
        <div className={styles.popupContent}>
          <h3 className={styles.popupTitle}>{skill.name}</h3>
          <p className={styles.popupDescription}>{skill.description}</p>
          <p className={styles.popupExperience}>
            {experienceLabel}: {skill.experience}
          </p>
          <button onClick={onClose} className={styles.popupButton}>
            {closeLabel}
          </button>
        </div>
      </motion.div>
    </>
  );

  return createPortal(popupContent, document.body);
};

export default SkillPopup;
