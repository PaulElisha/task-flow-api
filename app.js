import express from 'express';




PORT = process.env.PORT || 3000;
LOCALHOST = 'localhost';

class App {

    constructor() {
        this.app = express();
        this.setConfig();
    }

    setConfig() {
        this.app.use(express.json());
    }

    startServer() {
        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

