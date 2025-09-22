import { Request, Response } from 'express';

const controller = {
    index: (req: Request, res: Response) => {
        return res.status(200).json({
            success: true,
            message: 'API is healthy',
        });
    },
};

export default controller;
