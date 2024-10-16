export class CompanyData {
	constructor(client) {
		this.data = client.Company; // 이 부분에 각 모델(스키마)를 연결합니다.
	}

	// 이 아래로 직접 DB와 통신하는 코드를 작성합니다.
	// 여기서 DB와 통신해 받아온 데이터를 위로(service로) 올려줍니다.

	// 모든 기업 리스트 검색
	getCompanies = async ({ keyword, skip, take, sort, include, exclude }) => {
		let orderBy = [];
		switch (sort) {
			case 'accumulInvestDesc':
				orderBy.push({ accumulInvest: 'desc' });
				break;
			case 'accumulInvestAsc':
				orderBy.push({ accumulInvest: 'asc' });
				break;
			case 'earningDesc':
				orderBy.push({ revenue: 'desc' });
				break;
			case 'earningAsc':
				orderBy.push({ revenue: 'asc' });
				break;
			case 'employeeDesc':
				orderBy.push({ employees: 'desc' });
				break;
			case 'employeeAsc':
				orderBy.push({ employees: 'asc' });
				break;
			case 'recent':
			default:
				orderBy.push({ createdAt: 'desc' });
				break;
		}

		orderBy.push({ name: 'asc' });
		let includes;
		switch (include) {
			case 'watcherAndComparison':
				includes = {
					_count: {
						select: {
							watcherList: true,
							comparisons: true,
						},
					},
				};
				break;
			case 'investments':
				includes = { [include]: true };
				break;
			default:
				includes = undefined;
		}

		const where = {
			...(keyword
				? {
						OR: [{ name: { contains: keyword, mode: 'insensitive' } }, { category: { contains: keyword, mode: 'insensitive' } }],
					}
				: undefined),
			...(exclude && {
				id: {
					not: exclude,
				},
			}),
		};

		const totalCount = await this.data.count({
			where,
		});

		const companies = await this.data.findMany({
			where,
			orderBy,
			skip,
			take,
			include: includes,
		});

		let sortKey = Object.keys(orderBy[0])[0];
		let rank = skip + 1;
		let prevCompany = null;
		let offset = 1;
		const rankedCompanies = companies.map(company => {
			if (prevCompany && prevCompany[sortKey] !== company[sortKey]) {
				rank += offset;
				offset = 1;
			} else if (prevCompany) {
				offset++;
			}

			prevCompany = company;
			return { ...company, rank };
		});

		return { list: rankedCompanies, totalCount };
	};

	// 기업 수 계산
	getCompanyCount = async ({ keyword }) => {
		return await this.data.count({
			where: {
				OR: [{ name: { contains: keyword, mode: 'insensitive' } }, { category: { contains: keyword, mode: 'insensitive' } }],
			},
		});
	};

	// 기업 ID로 기업 정보 가져오기
	getCompanyById = async companyId => {
		return await this.data.findUnique({
			where: { id: companyId },
		});
	};
}
