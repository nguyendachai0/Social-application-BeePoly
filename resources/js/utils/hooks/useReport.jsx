import { useState } from "react";
import { router } from '@inertiajs/react';
import { toast } from "react-toastify";
const useReport = () => {

  const [reportTarget, setReportTarget] = useState(null);
  const [reportType, setReportType] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);

 

  const handleReport = (targetId, targetType) => {
    setReportTarget({ id: targetId, type: targetType });
    setShowReportModal(true);
  };

  const submitReport = () => {
    
    if (!reportTarget) {
      toast.error("No target to report.");
      return;
    }

    router.post('/reports', {
      [`reported_${reportTarget.type}_id`]: reportTarget.id, 
        report_type: reportType,
        details: reportDetails,
      }, {
        onSuccess: () => {
          setReportTarget(null);
          setReportType("");
          setReportDetails("");
          setShowReportModal(false);
          toast.info("Report submit successfully!")
        },
        onError: (errors) => {
          console.error("Failed to submit report:", errors);
        },
        preserveScroll: true
      });
  };

  return {
    reportTarget,
    reportType,
    setReportType,
    reportDetails,
    setReportDetails,
    showReportModal,
    setShowReportModal,
    submitReport,
    handleReport,
  };
};

export default useReport;
