const ErrorPopup = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <>
      <div className="fixed top-22 right-6 z-50 w-full max-w-sm rounded-xl bg-red-200 p-4 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <p className="text-red-800 font-medium">{message}</p>

          <button className="text-red-700 hover:text-red-900" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
    </>
  );
}

export default ErrorPopup;