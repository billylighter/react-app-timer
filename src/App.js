import React, {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Row, Col, ProgressBar, Container} from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const TimerApp = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            setShowModal(true);
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    useEffect(() => {
        if (isRunning) {
            const endTime = Date.now() + timeLeft * 1000;
            const updateRemainingTime = () => {
                const remainingTime = Math.max(0, Math.round((endTime - Date.now()) / 1000));
                setTimeLeft(remainingTime);
                if (remainingTime === 0) {
                    setIsRunning(false);
                    setShowModal(true);
                }
            };

            const intervalId = setInterval(updateRemainingTime, 1000);

            return () => clearInterval(intervalId);
        }
    }, [isRunning, timeLeft]);

    const startTimer = () => {
        const totalSeconds = hours * 3600 + minutes * 60 + seconds;
        if (totalSeconds > 0) {
            setTimeLeft(totalSeconds);
            setTotalTime(totalSeconds);
            setIsRunning(true);
        }
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(0);
        setTotalTime(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setShowModal(false);
    };

    const percentagePassed = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

    const formatTime = (time) => {
        const hrs = Math.floor(time / 3600);
        const mins = Math.floor((time % 3600) / 60);
        const secs = time % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
       <Container className="my-5">
           <Row>
               <Col md={6} className="mx-auto">

                   <h1 className="text-center">
                       React Timer
                   </h1>

                   <Row className="mb-4">

                       <Col>
                           <InputGroup className="mb-3">
                               <InputGroup.Text id="hour">
                                   H
                               </InputGroup.Text>
                               <Form.Control id="hour"
                                             type={'number'}
                                             aria-describedby="hour"
                                             value={hours}
                                             onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                                             disabled={isRunning}/>
                           </InputGroup>
                       </Col>

                       <Col>
                           <InputGroup className="mb-3">
                               <InputGroup.Text id="minutes">
                                   M
                               </InputGroup.Text>
                               <Form.Control id="minutes"
                                             type={'number'}
                                             aria-describedby="minutes"
                                             value={minutes}
                                             onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                                             disabled={isRunning}/>
                           </InputGroup>
                       </Col>

                       <Col>
                           <InputGroup className="mb-3">
                               <InputGroup.Text id="seconds">
                                   S
                               </InputGroup.Text>
                               <Form.Control id="seconds"
                                             type={'number'}
                                             aria-describedby="seconds"
                                             value={seconds}
                                             onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                                             disabled={isRunning}/>
                           </InputGroup>
                       </Col>

                   </Row>

                   <Row className="mb-4">

                       <Col>
                           <Button variant={'primary'} onClick={startTimer} className={'w-100'} disabled={isRunning}>
                               Start
                           </Button>
                       </Col>

                       <Col>
                           <Button variant={'danger'} onClick={resetTimer} className={'w-100'}>
                               Reset
                           </Button>
                       </Col>

                   </Row>

                   <ProgressBar animated={isRunning}
                                variant={'success'}
                                now={percentagePassed}
                                label={`${Math.round(percentagePassed)}%`}
                                className="mb-4"/>

                   <Row>

                       <Col className="text-center">
                           <h2>{formatTime(timeLeft)}</h2>
                       </Col>

                   </Row>

                   {showModal && (
                       <Modal show={showModal}>
                           <Modal.Header>
                               <Modal.Title>Time is over</Modal.Title>
                           </Modal.Header>
                           <Modal.Footer>
                               <Button variant="danger" onClick={() => setShowModal(false)}>Close</Button>
                           </Modal.Footer>
                       </Modal>
                   )}

               </Col>

           </Row>
       </Container>
    );
};

export default TimerApp;
