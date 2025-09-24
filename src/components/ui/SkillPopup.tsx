import React from 'react';
import { CSSTransition } from 'react-transition-group';

interface SkillPopupProps {
    skill: {
        name: string;
        experience: string;
        description: string;
    };
    onClose: () => void;
}

const SkillPopup: React.FC<SkillPopupProps> = ({ skill, onClose }) => {
    return (
        <>
            <div className="bg-black opacity-50 fixed inset-0" onClick={onClose}></div>
            <CSSTransition
                in={true}
                appear={true}
                timeout={300}
                classNames="popup"
                unmountOnExit
            >
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-800 text-gray-100 p-6 rounded-lg shadow-lg relative z-10 max-w-sm">
                        <h3 className="text-xl font-bold">{skill.name}</h3>
                        <p className="text-sm">{skill.description}</p>
                        <p className="text-sm font-semibold mt-2">Experiencia: {skill.experience}</p>
                        <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-1 px-3 rounded">Cerrar</button>
                    </div>
                </div>
            </CSSTransition>
        </>
    );
};

export default SkillPopup;
