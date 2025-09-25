import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillPopupProps {
    skill: {
        name: string;
        experience: string;
        description: string;
    };
    onClose: () => void;
}

const SkillPopup: React.FC<SkillPopupProps> = ({ skill, onClose }) => {
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    const popupVariants = {
        hidden: { 
            opacity: 0, 
            scale: 0.9,
            y: "-50%",
            x: "-50%"
        },
        visible: { 
            opacity: 1, 
            scale: 1,
            y: "-50%",
            x: "-50%"
        }
    };

    const popupContent = (
        <AnimatePresence>
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={backdropVariants}
                transition={{ duration: 0.3 }}
                onClick={onClose}
                style={{ 
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(17, 24, 39, 0.3)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 9999
                }}
            />
            <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={popupVariants}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ 
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    zIndex: 10000,
                    pointerEvents: 'none'
                }}
            >
                <div 
                    style={{
                        backgroundColor: '#1f2937',
                        color: '#f3f4f6',
                        padding: '1.5rem',
                        borderRadius: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        maxWidth: '24rem',
                        width: '90vw',
                        border: '1px solid #374151',
                        pointerEvents: 'auto'
                    }}
                >
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {skill.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                        {skill.description}
                    </p>
                    <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem' }}>
                        Experiencia: {skill.experience}
                    </p>
                    <button 
                        onClick={onClose} 
                        style={{
                            width: '100%',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.25rem',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                    >
                        Cerrar
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );

    return createPortal(popupContent, document.body);
};

export default SkillPopup;
