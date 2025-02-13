class AdminServiceClient extends NextAdmin.Services.HttpClient {

    public authTokenName?: string;

    public constructor(controllerUrl: string, authTokenName = 'NextAdminAuthToken', authToken?: string) {
        super(controllerUrl);
        if (authToken) {
            this.setAuthToken(authToken);
        }
    }

    setAuthToken(authToken: string) {
        this.headerParams[this.authTokenName] = authToken;
    }

    public async getAppConfig(): Promise<Models.AdminAppConfig> {
        let response = await this.get('getAppConfig', {});
        if (!response?.success)
            return null;
        return response.parseJson();
    }

}