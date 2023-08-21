const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ authorId: req.user.userId }).sort("-createdAt"); // sort in DESC
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const { userId } = req.user;
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId, authorId: userId });
  if (!job) {
    throw new BadRequestError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.authorId = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const { company, position } = req.body;
  const { userId } = req.user;
  const { id: jobId } = req.params;

  if (!company || !position) {
    throw new BadRequestError("Company or Position fields cannot be empty");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, authorId: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new BadRequestError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const { userId } = req.user;
  const { id: jobId } = req.params;

  const job = await Job.findOneAndDelete({ _id: jobId, authorId: userId });

  if (!job) {
    throw new BadRequestError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send("Deleted!");
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
