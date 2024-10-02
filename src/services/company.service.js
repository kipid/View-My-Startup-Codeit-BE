export class CompanyService {
	constructor(companyData) {
		this.data = companyData; // 이 부분에 data.js를 연결합니다.
	}

	// 이 아래로 데이터를 가공하는 코드를 작성합니다.
	// 비즈니스 로직, DB에서 가져온 데이터를 가공하는 코드가 주로 작성됩니다.
	// 여기서 가공된 데이터를 controller로 올려줍니다.

	// 기업 리스트 가져오기
	getCompanies = async ({ keyword, page, pageSize, orderBy }) => {
		return await this.data.findAll({ keyword, page, pageSize, orderBy });
	};

	// 기업 수 가져오기
	getCount = async ({ keyword }) => {
		return await this.data.count({ keyword });
	};

	// 기업 ID로 기업 정보 가져오기
	getCompanyById = async id => {
		return await this.data.findById(id);
	};

	// 내 기업 선택
	selectMyCompany = async (companyId, userId) => {
		return await this.data.selectMyCompany(companyId, userId);
	};

	// 비교할 기업 선택
	selectCompareCompanies = async (selectedCompanyIds, userId) => {
		return await this.data.selectCompareCompanies(selectedCompanyIds, userId);
	};
}
