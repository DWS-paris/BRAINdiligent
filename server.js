/* 
Import
*/
    // NodeJS
    require('dotenv').config();
    const express = require('express');
    const bodyParser = require('body-parser');
    const path = require('path');
    const ejs = require('ejs');

    // BrainJS
    const Brain = require('brain.js');
    const NeuralNetwork = new Brain.NeuralNetwork({
        activation: 'sigmoid',
        hiddenLayers: [2],
        iterations: 3000,
        learningRate: 0.5
    });

    const diligentTrain = [
        { input: { age: 0.68, earning: 0.168, schooling: 0.19 }, output: { diligent: 1 } },
        { input: { age: 0.53, earning: 0.117, schooling: 0.16 }, output: { diligent: 0 } },
        { input: { age: 0.31, earning: 0.198, schooling: 0.12 }, output: { diligent: 0 } },
        { input: { age: 0.30, earning: 0.126, schooling: 0.13 }, output: { diligent: 0 } },
        { input: { age: 0.43, earning: 0.131, schooling: 0.13 }, output: { diligent: 0 } },
        { input: { age: 0.48, earning: 0.227, schooling: 0.21 }, output: { diligent: 1 } },
        { input: { age: 0.71, earning: 0.148, schooling: 0.18 }, output: { diligent: 1 } },
        { input: { age: 0.60, earning: 0.047, schooling: 0.19 }, output: { diligent: 0 } },
        { input: { age: 0.56, earning: 0.214, schooling: 0.18 }, output: { diligent: 1 } },
        { input: { age: 0.57, earning: 0.133, schooling: 0.16 }, output: { diligent: 1 } },
        { input: { age: 0.41, earning: 0.203, schooling: 0.09 }, output: { diligent: 0 } },
        { input: { age: 0.68, earning: 0.176, schooling: 0.17 }, output: { diligent: 1 } },
        { input: { age: 0.59, earning: 0.059, schooling: 0.10 }, output: { diligent: 0 } },
        { input: { age: 0.49, earning: 0.040, schooling: 0.11 }, output: { diligent: 0 } },
        { input: { age: 0.71, earning: 0.038, schooling: 0.09 }, output: { diligent: 0 } },
        { input: { age: 0.58, earning: 0.058, schooling: 0.15 }, output: { diligent: 0 } },
        { input: { age: 0.75, earning: 0.093, schooling: 0.18 }, output: { diligent: 1 } },
        { input: { age: 0.61, earning: 0.160, schooling: 0.14 }, output: { diligent: 1 } },
        { input: { age: 0.46, earning: 0.169, schooling: 0.18 }, output: { diligent: 1 } },
    ]
//


/* 
Config
*/
    // Declarations
    const server = express();
    const apiRouter = express.Router({ mergeParams: true });
    const frontRouter = express.Router({ mergeParams: true });
    const Models = require('./models/index');
    const port = process.env.PORT

    // Server class
    class ServerClass{
        init(){
            // View engine configuration
            server.engine( 'html', ejs.renderFile );
            server.set('view engine', 'html');

            // Static path configuration
            server.set( 'views', __dirname + '/www' );
            server.use( express.static(path.join(__dirname, 'www')) );

            //=> Body-parser
            server.use(bodyParser.json({limit: '10mb'}));
            server.use(bodyParser.urlencoded({ extended: true }));


            //=> Set routers
            server.use('/api', apiRouter);
            server.use('/', frontRouter);

            // Start server
            this.launch();
        };

        trainBrain(){
            NeuralNetwork.train( diligentTrain, {
                log: true,
                logPeriod: 10,
                errorThresh: 0.002
            } )
        }

        frontRoutes(){
            /**
             * Route to display front page
             * @param path: String => any endpoints
            */
            frontRouter.get( '/*', (req, res) => res.render('index') );
        };

        apiRoutes(){
            apiRouter.post('/test/', (req, res) => {

                const userData = { 
                    age: req.body.age, 
                    earning: req.body.earning, 
                    schooling: req.body.schooling 
                }

                const brainResponse = NeuralNetwork.run( userData );

                return res.json(brainResponse)
            });
        };

        launch(){
            // Init Routers
            this.trainBrain()
            this.frontRoutes();
            this.apiRoutes();

            server.listen(port, () => console.log({ server: `http://localhost:${port}` }))
        };
    };
//


/* 
Start
*/
    new ServerClass().init();
//