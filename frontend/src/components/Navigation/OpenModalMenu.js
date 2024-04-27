import React from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useModal } from '../../context/Modal';

function Modal({ isOpen, onClose, winMessage, time, gameNumber }) {
    const history = useHistory();

    if (!isOpen) return null;

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleRestart = () => {
        history.push('/newgame');
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {winMessage && winMessage ? <div style={{
                backgroundColor: 'white',
                padding: 20,
                maxWidth: '600px',
                width: '50%',
                height: 'auto',
                borderRadius: '15px',
                textAlign: 'center'
            }}>
                <h2 style={{
                    marginTop: '50px',
                    fontSize: '20px',
                }}>Congratulations!<br></br>
                    You won the game with a score of {winMessage.score} and a finish time of {formatTime(time)}.
                    The number is {winMessage.gameNumber}.
                </h2>
                <button onClick={onClose}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >Close</button>
                <button onClick={handleRestart}
                    style={{
                        padding: '10px 20px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        backgroundColor: '#007BFF',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        marginLeft: '30px',
                        marginTop: '30px'
                    }}
                >Restart</button>
            </div> :
                <div style={{
                    backgroundColor: 'white',
                    padding: 20,
                    maxWidth: '600px',
                    width: '50%',
                    height: 'auto',
                    borderRadius: '15px',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        marginTop: '50px',
                        fontSize: '20px',
                    }}>Whoops! The number is {gameNumber}<br></br>
                        You've hit the 10-try limit this round. Restart and try again!<br></br>
                        You're getting better with every game.🌟
                    </h2>
                    <button onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px'
                        }}
                    >Close</button>
                    <button onClick={handleRestart}
                        style={{
                            padding: '10px 20px',
                            fontSize: '16px',
                            cursor: 'pointer',
                            backgroundColor: '#007BFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            marginLeft: '30px',
                            marginTop: '30px'
                        }}
                    >Restart</button>
                </div>
            }
        </div>
    );
}

export default Modal;
