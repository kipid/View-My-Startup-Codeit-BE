import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { Prisma } from '@prisma/client';
import { CastError, TypeError, ValidationError } from './utils/error.js';
import { StructError } from 'superstruct';
import { exampleRouter } from './routes/example.route.js';
import { companyRouter } from './routes/company.route.js';
import { investmentRouter } from './routes/investment.route.js';
import { comparisonRouter } from './routes/comparison.route.js';
import { watchRouter } from './routes/watch.route.js';
import { accountRouter } from './routes/account.route.js';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// BigInt를 처리하는 커스텀 JSON 파서
BigInt.prototype['toJSON'] = function () {
	return this.toString();
};

/***************************    ROUTES    **************************************************/
app.use('/example', exampleRouter); // /example로 이어지는 주소는 이 라우터로 갑니다.
app.use('/companies', companyRouter); // /companies로 이어지는 주소는 이 라우터로 갑니다.
app.use('/comparisons', comparisonRouter); // /comparisons로 이어지는 주소는 이 라우터로 갑니다.
app.use('/watches', watchRouter); // /watches로 이어지는 주소는 이 라우터로 갑니다.
app.use('/investments', investmentRouter); // /investments로 이어지는 주소는 이 라우터로 갑니다.
app.use('/account', accountRouter);

/***************************    HANDLER    **************************************************/
function errorHandler(err, req, res, next) {
	console.error(err);
	if (err instanceof Prisma.PrismaClientValidationError || err instanceof TypeError || err instanceof ValidationError) {
		res.status(400).send({ message: err.message });
	} else if (
		err instanceof StructError ||
		(err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') ||
		err instanceof CastError
	) {
		res.sendStatus(404);
	} else {
		res.status(500).send({ message: err.message });
	}
}

app.use(errorHandler);

app.listen(process.env.PORT || 3000, () => console.log('Server Started'));
