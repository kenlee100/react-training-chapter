import { useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectToast, removeToast } from "@/redux/toastSlice";

import { Toast as BStoast } from "bootstrap";

const TOAST_DURATION = 2000; // 幾秒後關閉
function ToastComponent() {
  const messages = useSelector(selectToast);
  const dispatch = useDispatch();
  const toastRef = useRef({});

  useEffect(() => {
    messages.forEach((message) => {
      const toastEl = toastRef.current[message.id];
      if (toastEl) {
        const toastInstance = new BStoast(toastEl);
        toastInstance.show();
        setTimeout(() => {
          dispatch(removeToast(message.id));
        }, TOAST_DURATION);
      }
    });
  }, [messages]);

  function closeToast(messageId) {
    dispatch(removeToast(messageId));
  }

  const statusText = useCallback(function (status) {
    switch (status) {
      case "success":
        return "成功";
      case "failed":
        return "失敗";
      default:
        return "";
    }
  }, []);
  return (
    <>
      <div
        className="toast-container position-fixed top-0 end-0 p-3"
        style={{ zIndex: 2000 }}
      >
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              ref={(el) => (toastRef.current[message.id] = el)}
              className="toast"
              aria-live="assertive"
              aria-atomic="true"
            >
              <div
                className={`toast-header ${
                  message.status === "success"
                    ? "text-bg-success"
                    : "text-bg-danger"
                }`}
              >
                <strong className="me-auto">
                  {statusText(message.status)}
                </strong>
                <button
                  onClick={() => closeToast(message.id)}
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                ></button>
              </div>
              <div className="toast-body">{message.text}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ToastComponent;
