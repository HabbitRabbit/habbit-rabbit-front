
function ProgressTracker({ habits, targetFrequency }) {
  return (
    <div className="mt-8 border-t pt-4">
      <p className="font-semibold text-indigo-800">Habits Progress:</p>
      {habits && habits.length > 0 ? (
        <div className="space-y-3">
          {habits.map((habitObj) => {
            const progress = (habitObj.achievedCount / targetFrequency) * 100;
            return (
              <div key={habitObj.habit._id} className="mb-2">
                <p>{habitObj.habit.title}</p>
                <div className="w-full bg-gray-200 h-4 rounded">
                  <div
                    className="bg-green-500 h-4 rounded"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p>{progress.toFixed(2)}% completed</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No habits available</p>
      )}
    </div>
  );
}

export default ProgressTracker;