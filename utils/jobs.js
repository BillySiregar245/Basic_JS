const jobs = new Map();

function createJob(task) {
  const jobId = `JOB_${Date.now()}`;
  jobs.set(jobId, { status: "queued" });

  
  setTimeout(() => {
    try {
      const result = task();
      jobs.set(jobId, { status: "completed", result });
    } catch (error) {
      jobs.set(jobId, { status: "failed", error: error.message });
    }
  }, 5000);

  return jobId;
}

function getJobStatus(jobId) {
  return jobs.get(jobId);
}

module.exports = { createJob, getJobStatus };
