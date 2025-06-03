var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.Biometrics_ApiService>("apiservice");

builder.AddProject<Projects.Biometrics_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithReference(apiService);

builder.Build().Run();
