import { useEffect, useRef, useState } from 'react';
import Button from 'src/components/ui/Button';
import Alert from 'src/components/ui/Alert';
import { startZigbeeJoin, stopZigbeeJoin } from 'src/services/api/devices';

const JOIN_DURATION = 30;

/**
 * ZigbeeAdding component responsible for managing the Zigbee device joining process.
 */
function ZigbeeAdding() {
  const [message, setMessage] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isStartClicked, setIsStartClicked] = useState(false);
  const [isStoppedClicked, setIsStoppedClicked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const intervalRef = useRef<number | null>(null);

  // Effect to stop the Zigbee join process when the component unmounts
  useEffect(() => {
    return () => {
      const stopJoin = async () => {
        try {
          await stopZigbeeJoin();
        } catch (error: unknown) {
          if (error instanceof Error) {
            console.error(`Error stopping Zigbee join: ${error.message}`);
          } else {
            console.error('Unexpected error stopping Zigbee join');
          }
        }
      };
      if (isRunning) {
        stopJoin();
      }
    };
  }, []);

  // Effect to handle the countdown timer
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  // Effect to handle the completion of the Zigbee join process
  useEffect(() => {
    if (timeLeft <= 0 && isRunning) {
      setIsRunning(false);
      setMessage('Zigbee join process completed.');
    }
  }, [timeLeft, isRunning]);

  /**
   * This function initiates the Zigbee join process for the specified duration.
   * @param time The duration in seconds for which to start the Zigbee join process.
   */
  const handleJoin = async (time: number) => {
    setMessage(null);
    setIsStartClicked(true);
    try {
      await startZigbeeJoin(time);
      setMessage('Zigbee join started successfully.');
      setIsRunning(true);
      setTimeLeft(time);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setMessage(`Unexpected error: ${error.message}`);
      } else {
        setMessage('Unexpected error');
      }
    } finally {
      setIsStartClicked(false);
    }
  };

  /**
   * This function stops the ongoing Zigbee join process.
   */
  const handleStop = async () => {
    setIsStoppedClicked(true);
    try {
      await stopZigbeeJoin();
      setMessage('Zigbee join stopped successfully.');
      setIsRunning(false);
      setTimeLeft(0);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        setMessage(`Unexpected error: ${error.message}`);
      } else {
        setMessage('Unexpected error');
      }
    } finally {
      setIsStoppedClicked(false);
    }
  };

  return (
    <>
      <h2 className="subpage-title">Zigbee Adding</h2>
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 items-center">
          <Button
            onClick={() => handleJoin(JOIN_DURATION)}
            disabled={isRunning || isStartClicked}
            variant="success"
            className="text-body-default py-5 px-10"
          >
            Start Zigbee Joining
          </Button>

          <Button
            onClick={handleStop}
            disabled={!isRunning || isStoppedClicked}
            variant="danger"
            className="text-body-default py-5 px-10"
          >
            Stop Zigbee Joining
          </Button>

          {isRunning && (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 font-semibold">
              {timeLeft}
            </div>
          )}
        </div>

        {message && <Alert message={message} type={'info'} />}
      </div>
    </>
  );
}

export default ZigbeeAdding;
