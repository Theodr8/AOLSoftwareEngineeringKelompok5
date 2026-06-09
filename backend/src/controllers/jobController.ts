import { Response } from "express";
import { AuthRequest } from "../middleware/requireAuth";
import prisma from "../lib/prisma";

export const allJobs = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(jobs);
  } catch (error: any) {
    return res.status(500).json({
      message: error.message || "Gagal mengambil jobs",
    });
  }
};

export const toggleSaveJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.userId;
    const jobId = req.params.jobId;

    const existing = await prisma.jobSave.findUnique({
      where: {
        userId_jobId: {
          userId: currentUserId,
          jobId,
        },
      },
    });

    if (existing) {
      await prisma.jobSave.delete({
        where: {
          userId_jobId: {
            userId: currentUserId,
            jobId,
          },
        },
      });

      return res.json({
        saved: false,
        message: "Job berhasil dihapus dari saved",
      });
    }

    await prisma.jobSave.create({
      data: {
        userId: currentUserId,
        jobId,
      },
    });

    return res.json({
      saved: true,
      message: "Job berhasil disimpan",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const viewSaveJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.userId;

    const savedJobs = await prisma.jobSave.findMany({
      where: {
        userId: currentUserId,
      },
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(savedJobs.map((item) => item.job));
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const applyJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.userId;
    const jobId = req.params.jobId;

    const existing = await prisma.jobApplication.findUnique({
      where: {
        userId_jobId: {
          userId: currentUserId,
          jobId,
        },
      },
    });

    if (existing) {
      return res.status(400).json({
        message: "Anda sudah melamar job ini",
      });
    }

    await prisma.jobApplication.create({
      data: {
        userId: currentUserId,
        jobId,
      },
    });

    return res.json({
      message: "Berhasil melamar pekerjaan",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const unapplyJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.userId;
    const jobId = req.params.jobId;

    await prisma.jobApplication.delete({
      where: {
        userId_jobId: {
          userId: currentUserId,
          jobId,
        },
      },
    });

    return res.json({
      message: "Lamaran dibatalkan",
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const viewAppliedJob = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const currentUserId = req.user.userId;

    const appliedJobs = await prisma.jobApplication.findMany({
      where: {
        userId: currentUserId,
      },
      include: {
        job: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(appliedJobs.map((item) => item.job));
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};