export class InvestmentData {
	constructor(client) {
		this.data = client.Investment; // 이 부분에 각 모델(스키마)를 연결합니다.
	}

	// 이 아래로 직접 DB와 통신하는 코드를 작성합니다.
	// 여기서 DB와 통신해 받아온 데이터를 위로(service로) 올려줍니다.
	count = async companyId => {
		const query = companyId ? { where: { companyId } } : {};

		const count = await this.data.count(query);

		return count;
	};

	findMany = async (orderBy, page, pageSize, companyId) => {
		const where = companyId ? { where: { companyId } } : {};

		let sortOption;
		switch (orderBy) {
			case 'smaller':
				sortOption = { orderBy: { amount: 'asc' } };
				break;
			case 'bigger':
			default:
				sortOption = { orderBy: { amount: 'desc' } };
		}

		const investments = await this.data.findMany({ ...where, ...sortOption, take: pageSize, skip: (page - 1) * pageSize });

		return investments;
	};

	findAmounts = async companyId => {
		const amounts = await this.data.findMany({ where: { companyId }, select: { amount: true } });

		return amounts;
	};

	findById = async id => {
		const investment = await this.data.findUnique({ where: { id } });

		return investment;
	};

	create = async data => {
		Object.keys(data).forEach(key => {
			if (typeof data[key] === 'string') {
				data[key] = data[key].trim();
			}
		});
		const investment = await this.data.create({ data });

		return investment;
	};

	update = async (id, data) => {
		Object.keys(data).forEach(key => {
			if (typeof data[key] === 'string') {
				data[key] = data[key].trim();
			}
		});
		const investment = await this.data.update({ where: { id }, data });

		return investment;
	};

	delete = async id => {
		const investment = await this.data.delete({ where: { id } });

		return investment;
	};

	countByUser = async userId => {
		const query = userId ? { where: { userId } } : {};

		const count = await this.data.count(query);

		return count;
	};

	findManyByUser = async (orderBy, page, pageSize, userId) => {
		const where = userId ? { where: { userId } } : {};

		let sortOption;
		switch (orderBy) {
			case 'old':
				sortOption = { orderBy: { createdAt: 'asc' } };
				break;
			case 'recent':
			default:
				sortOption = { orderBy: { createdAt: 'desc' } };
		}

		const myInvestments = await this.data.findMany({ ...where, ...sortOption, take: pageSize, skip: (page - 1) * pageSize, include: { company: true } });

		return myInvestments;
	};
}
