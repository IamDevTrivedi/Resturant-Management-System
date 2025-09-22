import { Request, Response } from 'express';

const controller = {
    index: (req: Request, res: Response) => {
        return res.status(200).json({
            success: true,
            message: 'Create-Auth-App is running',
        });
    },
};

export default controller;
