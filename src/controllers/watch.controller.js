import HttpStatus from "../utils/HttpStatus.js";

export class WatchController {
	constructor(watchService) {
		this.service = watchService;
	}

	// '나의 기업' 선택
	selectMyCompany = async (req, res) => {
		const { companyId, userId } = req.body;
		try {
			const watch = await this.service.selectMyCompany(companyId, userId);
			res.status(HttpStatus.SUCCESS).json(watch);
		} catch (error) {
			res.status(HttpStatus.SERVER_ERROR).json({ error: error.message });
		}
	};

	// '나의 기업' 조회
	getMyCompany = async (req, res) => {
		const { userId } = req.params;
		try {
			const watch = await this.service.getMyCompany(userId);
			res.status(HttpStatus.SUCCESS).json(watch);
		} catch (error) {
			res.status(HttpStatus.SERVER_ERROR).json({ error: error.message });
		}
	};
}
