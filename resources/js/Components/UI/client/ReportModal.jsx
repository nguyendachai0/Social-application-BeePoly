const ReportModal = ({reportTarget, reportType, setReportType,  reportDetails, submitReport, setReportDetails, setShowReportModal}) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Report {reportTarget?.type  ===  "post" ? "Post" : "Comment"}</h2>
          <button
            onClick={() => setShowReportModal(false)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close report modal"
          >
            ×
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="abuse">Abuse</option>
              <option value="inappropriate">Inappropriate Content</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Additional Details</label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="w-full p-2 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide more details about your report..."
            ></textarea>
          </div>
          <button
            onClick={submitReport}
            disabled={!reportType}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );

export default ReportModal;