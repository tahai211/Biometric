using Microsoft.IdentityModel.Tokens;
//using System;
//using System.IO;
//using System.Net;
//using System.Linq;
//using Serilog;
//using DataModel.Models;
//using IDP.Utilities;
//using IDP.Utilities.Common;
//using System.Threading;
//using System.Threading.Tasks;
//using System.Collections.Generic;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.DependencyInjection;
//using FluentFTP;
//using Newtonsoft.Json;

namespace Biometrics.ApiService.Infra.Common
{
    public class FileUtility
    {
        //Simple: call Execute on the function editor to test
        //public static async ValueTask<object> Execute()
        //{
        //    string base64 = "eyJhZGQiOiJUaMOqbSIsImFkZG5ldyI6IlRow6ptIG3hu5tpIiwiYWR2YW5jZWFtb3VudCI6IlPhu5EgdGnhu4FuIOG7qW5nIHRyxrDhu5tjIiwiYWR2YW5jZWRpbmZvbWF0aW9uIjoiVGjDtG5nIHRpbiB0aMOqbSIsImFwaWFkZCI6IkFQSSBUaMOqbSIsImFwaWNoYW5uZWxwb3J0bGlzdCI6IkFQSSBkYW5oIHPDoWNoIGPhu5VuZyIsImFwaWVkaXQiOiJBUEkgU+G7rWEiLCJhcGlnYXRld2F5ZXhlY3V0ZXRpbWUiOiJUaOG7nWkgZ2lhbiDEkcSDbmcgbmjhuq1wIGPhu5VuZyBBUEkiLCJhcGlnYXRld2F5cmVzcG9uc2V0b3BzbG93IjoiQ+G7lW5nIHBo4bqjbiBk4buTaSBBUEkgY2jhuq1tIG5o4bqldCIsImFwaWdhdGV3YXlzZXJ2ZXJuZXR3b3JrIjoiQ+G7lW5nIEFQSSBz4butIGThu6VuZyBtw6F5IGNo4bunIiwiYXBpZ2F0ZXdheXNlcnZlcnNlcnZlcnVzYWdlIjoiTcOheSBjaOG7pyBBUEkga+G6v3QgbuG7kWkiLCJhcGlob21lIjoiQVBJIFRyYW5nIGNo4bunIiwiYXBpbWFuYWdlbWVudHJvbGUiOiJBUEkgRGFuaCBzw6FjaCBxdeG6o24gbMO9IHF1eeG7gW4iLCJhcGlwcm9maWxlaWQiOiJBUEkgUHJvZmlsZSBJRCIsImFwaXRvcHNsb3ciOiJBUEkgcGjhuqNuIGjhu5NpIGNo4bqtbSBuaOG6pXQiLCJhcHBsaW5raXNleGlzdGVkIjoiQXBwbGluayDEkcOjIHThu5NuIHThuqFpIiwiYXBwbHljaGFuZ2UiOiJMxrB1IHRoYXkgxJHhu5VpIiwiYXJleW91c3VyZSI6IkLhuqFuIGPDsyBjaOG6r2MgY2jhuq9uIG114buRbiBsxrB1PyIsImFyZXlvdXN1cmVkZWxldGUiOiJC4bqhbiBjaOG6r2MgY2jhuq9uIG114buRbiB4w7NhIGtow7RuZyA/IiwiYXJleW91c3VyZWRlbGV0ZT8iOiJC4bqhbiBjw7MgY2jhuq9jIGNo4bqvbiB4w7NhIGtow7RuZz8iLCJhc3NpZ251c2VyZ3JvdXAiOiJDaOG7iSDEkeG7i25oIG5ow7NtIG5nxrDhu51pIGTDuW5nIiwiYmFjayI6IlF1YXkgbOG6oWkiLCJiYW5rd2FybmluZyI6IkPhuqNuaCBiw6FvIGLhuqNvIG3huq10IiwiYmFzaWNpbmZvbWF0aW9uIjoiVGjDtG5nIHRpbiBjxqEgYuG6o24iLCJib2R5cmVxdWVzdCI6IkJvZHkgcmVxdWVzdCIsImJvZHlyZXF1ZXN0aXNyZXF1aXJlZCI6ImJvZHlyZXF1ZXN0aXNyZXF1aXJlZCIsImJvZHlyZXNwb25zZWlzcmVxdWlyZWQiOiJib2R5cmVzcG9uc2Vpc3JlcXVpcmVkIiwiYm9yZXNlbmR1c2VybmFtZSI6ImJvcmVzZW5kdXNlcm5hbWUiLCJib3Jlc2VuZHVzZXJuYW1lYXBwcm92ZSI6ImJvcmVzZW5kdXNlcm5hbWVhcHByb3ZlIiwiYm9yZXNlbmR1c2VybmFtZWRldGFpbCI6ImJvcmVzZW5kdXNlcm5hbWVkZXRhaWwiLCJib3Jlc2VuZHVzZXJuYW1lZm9yY3VzdG9tZXIiOiJib3Jlc2VuZHVzZXJuYW1lZm9yY3VzdG9tZXIiLCJib3Jlc2VuZHVzZXJuYW1lcmVxdWVzdCI6ImJvcmVzZW5kdXNlcm5hbWVyZXF1ZXN0IiwiY2FjaGVleHBpcmF0aW9udGltZSI6IlRo4budaSBnaWFuIGjhur90IGjhuqFuIENhY2hlIChnacOieSkiLCJjYW5vdGdldGJhbGFuY2UiOiJjYW5vdGdldGJhbGFuY2UiLCJjaGFuZ2VwYXNzZmlyc3Rsb2dpbiI6IkFQSSBUaGF5IMSR4buVaSBt4bqtdCBraOG6qXUgbOG6p24gxJHhuqd1IMSRxINuZyBuaOG6rXAiLCJjaG9vc2VsYW5ndWFnZSI6IkNo4buNbiBuZ8O0biBuZ+G7ryIsImNob29zZXRoZW1lIjoiQ2jhu41uIGNo4bunIMSR4buBIiwiY2xlYXIiOiJMb+G6oWkgYuG7jyIsImNvbmZpcm1uZXdwYXNzd29yZCI6Ik5o4bqtcCBs4bqhaSBt4bqtdCBraOG6qXUgbeG7m2kiLCJjb25maXJtcGFzc3dvcmQiOiJOaOG6rXAgbOG6oWkgbeG6rXQga2jhuql1IiwiY29udGVudDEiOiJO4buZaSBkdW5nIDEiLCJDdXJyZW5jeSI6Ikxv4bqhaSB0aeG7gW4iLCJjdXN0b21lcm5hbWUiOiJUw6puIGtow6FjaCBow6BuZyIsImRhdGUiOiJOZ8OgeSIsImRlbGV0ZSI6IljDs2EiLCJkZXRhaWxhcGlwcm9maWxlIjoiQVBJIENoaSB0aeG6v3QgaOG7kyBzxqEiLCJkZXRhaWxhcGlwcm9maWxlZGV0YWlsIjoiQ2hpIHRp4bq/dCBBUEkgcHJvZmlsZSIsImRldGFpbGNoYW5uZWxwb3J0IjoiQVBJIENoaSB0aeG6v3QgY+G7lW5nIHF14bqjbiBsw70iLCJkZXRhaWxvZmFwaSI6IkFQSSBYZW0iLCJkZXRhaWxzb2ZyZW1pdHRhbmNlIjoiVGjDtG5nIHRpbiBjaHV54buDbiB0aeG7gW4gY2hpIHRp4bq/dCIsImRldGFpbHNvZnVzZXIiOiJBUEkgWGVtIHF14bqjbiBsw70gbmfGsOG7nWkgZMO5bmciLCJkZXRhaWx0cmFuc2FjdGlvbmNhdGFsb2ciOiJDTVMgQ2hpIHRp4bq/dCBkYW5oIG3hu6VjIGdpYW8gZOG7i2NoIiwiZG95b3VzdGF5c2lnbmluIjoiQmHMo24gY2/MgSBtdcO0zIFuIHRpw6rMgXAgdHXMo2MgPyIsImVkaXQiOiJT4butYSIsImVkaXRhcGljaGFubmVscG9ydCI6IkFQSSBDaOG7iW5oIHPhu61hIGPhu5VuZyIsImVkaXRhcGlwcm9maWxlIjoiQVBJIENo4buJbmggc+G7rWEgaOG7kyBzxqEiLCJlZGl0YXBpcHJvZmlsZWRldGFpbCI6IkNo4buJbmggc+G7rWEgQVBJIFByb2ZpbGUiLCJlbG9hZCI6IkVMb2FkIiwiZW1haWwiOiJFbWFpbCIsImVuZHBvaW50cGF0aGlzcmVxdWlyZWQiOiJlbmRwb2ludHBhdGhpc3JlcXVpcmVkIiwiZXJyb3IiOiJM4buXaSIsImVycm9yZGVzYyI6ImVycm9yZGVzYyIsImVycm9yaWQiOiJNw6MgTOG7l2k6IiwiZmFpbGVkIjoiVGjhuqV0IGLhuqFpIiwiZmFzdGludGVyYmFua3RyYW5mZXJmdW5kIjoiZmFzdGludGVyYmFua3RyYW5mZXJmdW5kIiwiZmllbGRuYW1lIjoiVMOqbiB0csaw4budbmciLCJmaWxlbmFtZSI6IlTDqm4gZmlsZSIsImZpcnN0bmFtZSI6Ikjhu40iLCJmb3IiOiJjaG8iLCJmb3JtIjoiQmnhu4N1IG3huqt1IiwiZnVsbCI6IkLhuqNuIEJ1aWxkIiwiZnVuY3Rpb25leGVjdXRpb25zbG93ZXN0IjoiQ2jhu6ljIG7Eg25nX0No4bq/IMSR4buZX1Bo4bqjbiBo4buTaSBjaOG6rW0gbmjhuqV0IiwiZnVuY3Rpb25leGVjdXRpb25zdW1tYXJ5IjoiVGjhu7FjIGhp4buHbiB0w7NtIHThuq90IGNo4bupYyBuxINuZyIsImZ1bmN0aW9uaXNjb21pbmdzb29uIjoiZnVuY3Rpb25pc2NvbWluZ3Nvb24iLCJob3N0YW5kcG9ydGlzcmVxdWlyZWQiOiJob3N0YW5kcG9ydGlzcmVxdWlyZWQiLCJob3N0cHJvdG9jb2wiOiJIb3N0IFByb3RvY29sIiwiaHR0cG1ldGhvZGlzcmVxdWlyZWQiOiJodHRwbWV0aG9kaXNyZXF1aXJlZCIsImh0dHByZXF1ZXN0c3VtbWFyeSI6IlnDqnUgY+G6p3UgdMOzbSB04bqvdCBIVFRQIiwiaWJjYXRwYXltZW50b25saW5lIjoiaWJjYXRwYXltZW50b25saW5lIiwiaWJmYXN0aW50ZXJiYW5rdHJhbnNmZXIiOiJpYmZhc3RpbnRlcmJhbmt0cmFuc2ZlciIsImliaW50ZXJuYXRpb25hbGJhbmt0cmFuc2ZlciI6IkNodXnhu4NuIHRp4buBbiBxdeG7kWMgdOG6vyIsImlucHV0IjoixJDhuqd1IHbDoG8iLCJpbnRlcnNlcnZpY2VyZXF1ZXN0c3VtbWFyeSI6IlTDs20gdOG6r3QgecOqdSBj4bqndSBsacOqbiBk4buLY2ggduG7pSIsImlzZGVmYXVsdCI6Ik3hurdjIMSR4buLbmg/Iiwia2VlcHNpZ2luIjoiR2nGsMyDIMSRxINuZyBuaMOizKNwIiwia2V5IjoiVOG7qyBraMOzYSIsImxhbmd1YWdlIjoiTmfDtG4gbmfhu68iLCJsaW1pdCI6IkjhuqFuIG3hu6ljIiwibGlzdCI6IkRhbmggc8OhY2giLCJsaXN0b2ZhcGlzIjoiQVBJIERhbmggc8OhY2ggbeG7pWMiLCJsaXN0b2Zwcm9maWxlIjoiQVBJIERhbmggc8OhY2ggaOG7kyBzxqEiLCJsaXN0b2Zwcm9maWxlZGV0YWlsIjoiRGFuaCBzw6FjaCBBUEkgUHJvZmlsZSIsImxvZ2luIjoixJDEg25nIG5o4bqtcCIsImxvZ2luYnlhbm90aGVyZGl2aWNlIjoibG9naW5ieWFub3RoZXJkaXZpY2UiLCJsb2dvdXQiOiLEkMSDbmcgeHXhuqV0IiwibWJjYXRwYXltZW50b25saW5lIjoibWJjYXRwYXltZW50b25saW5lIiwibXlwcm9maWxlIjoiQVBJIHRow7RuZyB0aW4gbmfGsOG7nWkgZMO5bmciLCJuYW1lIjoiVMOqbiIsIm5ldyI6Ik3hu5tpIiwib2siOiJPSyIsIm9wdGlvbnMiOiJUw7l5IGNo4buNbiIsIm9yIjoiaG/hurdjIiwib3JkZXIiOiJM4buHbmgiLCJvdGhlciI6Iktow6FjIiwicGFnZXNpemUiOiJQYWdlIFNpemUiLCJwYWdpbmF0aW9uIjoiUGjDom4gdHJhbmciLCJwYXNzd29yZCI6Ik3huq10IGto4bqpdSIsInBhdGh0ZW1wbGF0ZWlzcmVxdWlyZWQiOiJwYXRodGVtcGxhdGVpc3JlcXVpcmVkIiwicGVuZGluZ3Jlc2VuZHVzZXJuYW1lIjoicGVuZGluZ3Jlc2VuZHVzZXJuYW1lIiwicGhvbmUiOiJT4buRIMSRaeG7h24gdGhv4bqhaSIsInBob25lbm8iOiJT4buRIMSRaeG7h24gdGhv4bqhaSIsInBvcnRhbCI6IkPhu5VuZyB0aMO0bmcgdGluIiwicG9zaXRpb24iOiJDaOG7qWMgduG7pSIsInByZWZpeCI6IlRp4buBbiB04buRIiwicHJvZmlsZWFkZCI6IkFQSSBUaMOqbSBo4buTIHPGoSIsInByb2ZpbGVkZXRhaWxhZGQiOiJUaMOqbSBBUEkgcHJvZmlsZSIsIlFvU09wdGlvbnMiOiJDaOG6pXQgbMaw4bujbmcgZOG7i2NoIHbhu6UiLCJyZWNlaXZlcnBhcGVybm8iOiJyZWNlaXZlcnBhcGVybm8iLCJyZXNlbmR0eXBlIjoicmVzZW5kdHlwZSIsInJlc2VuZHVzZXJuYW1lZm9yY3VzdG9tZXIiOiJyZXNlbmR1c2VybmFtZWZvcmN1c3RvbWVyIiwicmVzZW5kdXNlcm5hbWVzdWNjZXNzZnVsbHkiOiJyZXNlbmR1c2VybmFtZXN1Y2Nlc3NmdWxseSIsInJlc2V0IjoiQ8OgaSBs4bqhaSIsInJlc3VsdCI6Ikvhur90IHF14bqjIiwicmlnaHQiOiJRdXnhu4FuIiwicm9sZSI6IlF1eeG7gW4iLCJyb2xlYWRkIjoiVGjDqm0gbeG7m2kiLCJyb2xlZGV0YWlsIjoiQ2hpIHRp4bq/dCIsInJvbGVlZGl0IjoiQ2jhu4luaCBz4butYSIsInJvbGVpZCI6Ik3DoyBwaMOibiBxdXnhu4FuIiwicm9sZW5hbWUiOiJQaMOibiBxdXnhu4FuIiwicm9sZXR5cGUiOiJMb+G6oWkgcXV54buBbiIsInNhdmUiOiJMxrB1Iiwic2F2ZWFkZCI6IkzGsHUgdGjDqm0iLCJzZWFyY2giOiJUw6xtIGtp4bq/bSIsInNlY29uZHMiOiJHacOieSIsInNlY3VyaXR5IjoiQuG6o28gbeG6rXQiLCJzZWxlY3RsYW5ndWFnZSI6Ikzhu7FhIGNo4buNbiBuZ8O0biBuZ+G7ryIsInNlbGZpZWltYWdlaXNyZXF1aXJlZCI6InNlbGZpZWltYWdlaXNyZXF1aXJlZCIsInNlbGwiOiJCw6FuIiwic2VydmljZSI6IkThu4tjaCB24bulIiwic2VydmljZWlzcmVxdWlyZWQiOiJE4buLY2ggduG7pSBsw6AgYuG6r3QgYnXhu5ljIiwic2VydmljZW5hbWUiOiJUw6puIGThu4tjaCB24bulIiwic2V0dGluZyI6IkPDoGkgxJHhurd0Iiwic2V0dGluZ3MiOiJDw6BpIMSR4bq3dCIsInNpZ25tZW91dCI6Iktow7RuZywgxJDEg25nIFh1w6LMgXQiLCJzdGF0dXMiOiJUcuG6oW5nIHRow6FpIiwic3VibWl0IjoiWMOhYyBuaOG6rW4iLCJzdWJtaXQxIjoiR+G7rWkiLCJzdWNjZXNzIjoiVGjDoG5oIGPDtG5nIiwic3VjY2Vzc2Z1bCI6IlRow6BuaCBjw7RuZyIsInN1Y2Nlc3NmdWxseSI6IlRow6BuaCBjw7RuZyIsInN3YWdnZXIiOiJTd2FnZ2VyIiwic3dhZ2dlcmVkaXRlciI6InN3YWdnZXJlZGl0ZXIiLCJzeXN0ZW1jcHV1c2FnZSI6IlThu4kgbOG7hyBz4butIGThu6VuZyBDUFUiLCJzeXN0ZW1tZW1vcnl1c2FnZSI6IlPhu60gZOG7pW5nIGLhu5kgbmjhu5sgaOG7hyB0aOG7kW5nIiwidGVtcGxhdGUiOiJN4bqrdSBnaWFvIGThu4tjaCIsInRpbWUiOiJUaOG7nWkgZ2lhbiIsInRvIjoixJDhur9uIiwidG9wbW9zdGNhbGxlbmRwb2ludGNoYXJ0IjoiRGFuaCBzw6FjaCBn4buNaSBnaWFvIGThu4tjaCBn4bqnbiBuaOG6pXQgaGnhu4NuIHRo4buLIHRyw6puIGJp4buDdSDEkeG7kyIsInRyYW5jb2RlIjoiTG/huqFpIGdpYW8gZOG7i2NoIiwidHJhbnNhY3Rpb25jb2RlIjoiTcOjIGdpYW8gZOG7i2NoIiwidHJhbnNhY3Rpb25uYW1lIjoiVMOqbiBnaWFvIGThu4tjaCIsInRyYW5zYWN0aW9udHlwZSI6Ikxv4bqhaSBnaWFvIGThu4tjaCIsInRyaWdnZXIiOiJLw61jaCBob+G6oXQiLCJ0eXBlIjoiTG/huqFpIiwidW5hdXRob3JpemF0aW9uYmlvbWV0cmljIjoidW5hdXRob3JpemF0aW9uYmlvbWV0cmljIiwidW5ibG9jayI6IkLhu48gY2jhurduIiwidXBkYXRlIjoiQ+G6rXAgbmjhuq10IiwidXBsb2FkIjoiVOG6o2kgbMOqbiIsInVybCI6IlVSTCIsInVzZXJlZGl0IjoiQ2jhu4luaCBz4butYSBuZ8aw4budaSBkw7luZyIsInVzZXJncm91cCI6Ik5ow7NtIG5nxrDhu51pIGTDuW5nIiwidXNlcmlkIjoiSUQgbmfGsOG7nWkgZMO5bmciLCJ1c2VyaW5mbyI6IlRow7RuZyB0aW4gbmfGsOG7nWkgZMO5bmciLCJ1c2VyaW5mb3JtYXRpb24iOiJUaMO0bmcgdGluIG5nxrDhu51pIGTDuW5nIiwidXNlcm1hbmFnZW1lbnQiOiJRdeG6o24gbMO9IG5nxrDhu51pIGTDuW5nIiwidXNlcm5hbWUiOiJUw6puIMSRxINuZyBuaOG6rXAiLCJ1c2VycHJvZmlsZSI6Ikjhu5Mgc8ahIG5nxrDhu51pIGTDuW5nIiwidXNlcnR5cGUiOiJMb+G6oWkgbmfGsOG7nWkgZMO5bmciLCJ2YWx1ZSI6Ikdpw6EgdHLhu4siLCJ2YWx1ZW5hbWUiOiJUw6puIGdpw6EgdHLhu4siLCJ2ZXJzaW9uaXNyZXF1aXJlZCI6InZlcnNpb25pc3JlcXVpcmVkIiwidmVyc2lvbnN0YXR1c2lzcmVxdWlyZWQiOiJ2ZXJzaW9uc3RhdHVzaXNyZXF1aXJlZCIsInZpZXciOiJYZW0gY2hpIHRp4bq/dCIsIndhcm5pbmciOiJD4bqjbmggYsOhbyIsInllcyI6IsSQ4buTbmcgw70iLCJ5b3Vkb250aGF2ZWFuY2JzYWNjb3VudCI6InlvdWRvbnRoYXZlYW5jYnNhY2NvdW50IiwieW91cnNlc3Npb25oYXNiZWVuZXhwaXJlZCI6IlBoacOqbiDEkcSDbmcgbmjhuq1wIGPhu6dhIGLhuqFuIMSRw6MgaOG6v3QgaOG6oW4uIELhuqFuIHPhur0gxJHGsOG7o2MgY2h1eeG7g24gdOG7m2kgbcOgbiDEkcSDbmcgbmjhuq1wIiwieW91cnNlc3Npb25pc2Fib3V0dG9leHBpcmUiOiJQaGnDqm4gxJHEg25nIG5ow6LMo3AgY3XMiWEgYmHMo24gc8SDzIFwIGjDqsyBdCBoYcyjbiwgYmHMo24gc2XMgyBiacyjIMSRxINuZyB4dcOizIF0IHNhdSJ9";
        //    return await ReadDocumentFTP("/language/application/json/20241219/en-US.json/03d0b16fec7843a3b3fb0810a206f47f");
        //}
        //public class DocumentInfo
        //{
        //    public string DocumentId { get; set; }
        //    public string DocumentPath { get; set; }
        //    public string StorageType { get; set; }
        //}
        //public static async ValueTask<string> ReadDocumentFTP(string pathRoot)
        //{
        //    try
        //    {
        //        string path = Path.Combine(pathRoot).Replace(@"\", "/");
        //        var token = new CancellationToken();
        //        using (var ftp = new AsyncFtpClient(Utility.SysVariable.Get("STORAGEURI"), Utility.SysVariable.Get("STORAGEUSER"), Utility.SysVariable.Get("STORAGEPASS")))
        //        {
        //            await ftp.Connect(token);
        //            if (await ftp.FileExists(path, token))
        //            {
        //                byte[] fileBytes = await ftp.DownloadBytes(path, token);
        //                string fileContent = System.Text.Encoding.UTF8.GetString(fileBytes);
        //                return fileContent;
        //            }
        //            else
        //            {
        //                return "";
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return "";
        //    }

        //}
        ////Simple 20220913 upload document (return documentid)
        //public static async ValueTask<DocumentInfo> UploadDocument(string base64File, string documentType, string documentName = "")
        //{
        //    try
        //    {
        //        string documentId = Guid.NewGuid().ToString("N");
        //        string storageType = Utility.SysVariable.Get("STORAGETYPE");
        //        var bytes = Convert.FromBase64String(base64File);

        //        switch (storageType)
        //        {
        //            case Utilities.Constant.STORAGETYPE.FTP:
        //                string path = await UploadDocumentFTP(bytes, documentType, documentName, documentId);
        //                return new DocumentInfo { DocumentId = documentId, DocumentPath = path, StorageType = storageType };
        //            default:
        //                throw new Exception($"Storage type {storageType} is not support, unable to upload document");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.ToString());
        //        Log.Error(ex.ToString());
        //        Log.Information($"Please manual upload document with:\r\nType:{documentType}\r\nName:{documentName}\r\nFile:{base64File}");
        //    }

        //    return null;

        //}
        //private static async Task<string> UploadDocumentFTP(byte[] fileBytesArray, string documentType, string documentName, string fileName)
        //{
        //    string datenow = DateTime.Now.ToString("yyyyMMdd");
        //    string rootPath = Utility.SysVariable.Get("DOCUMENTROOTPATH");
        //    string path = Path.Combine(rootPath, documentType, datenow, documentName, fileName).Replace(@"\", "/");
        //    var token = new CancellationToken();
        //    using (var ftp = new AsyncFtpClient(Utility.SysVariable.Get("STORAGEURI"), Utility.SysVariable.Get("STORAGEUSER"), Utility.SysVariable.Get("STORAGEPASS")))
        //    {
        //        await ftp.Connect(token);
        //        await ftp.UploadBytes(fileBytesArray, path, FtpRemoteExists.Overwrite, true);
        //    }
        //    return path;
        //}
        //public static async ValueTask<DocumentInfo> UploadDocumentStatic(string base64File, string documentType, string documentName = "", string rootPath = "")
        //{
        //    try
        //    {
        //        string documentId = Guid.NewGuid().ToString("N");
        //        string storageType = Utility.SysVariable.Get("STORAGETYPE");
        //        var bytes = Convert.FromBase64String(base64File);

        //        switch (storageType)
        //        {
        //            case Utilities.Constant.STORAGETYPE.FTP:
        //                string path = await UploadDocumentStaticFTP(bytes, documentType, documentName, documentId, rootPath);
        //                return new DocumentInfo { DocumentId = documentId, DocumentPath = path, StorageType = storageType };
        //            default:
        //                throw new Exception($"Storage type {storageType} is not support, unable to upload document");
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.ToString());
        //        Log.Error(ex.ToString());
        //        Log.Information($"Please manual upload document with:\r\nType:{documentType}\r\nName:{documentName}\r\nFile:{base64File}");
        //    }
        //    return null;
        //}
        //private static async Task<string> UploadDocumentStaticFTP(byte[] fileBytesArray, string documentType, string documentName, string fileName, string rootPath)
        //{
        //    string datenow = DateTime.Now.ToString("yyyyMMdd");
        //    //string rootPath = Utility.SysVariable.Get("DOCUMENTSTATICROOTPATH");
        //    string path = Path.Combine(rootPath, documentType, datenow, documentName, fileName).Replace(@"\", "/");
        //    var token = new CancellationToken();
        //    using (var ftp = new AsyncFtpClient(Utility.SysVariable.Get("STORAGEURI"), Utility.SysVariable.Get("STORAGEUSER"), Utility.SysVariable.Get("STORAGEPASS")))
        //    {
        //        await ftp.Connect(token);
        //        await ftp.UploadBytes(fileBytesArray, path, FtpRemoteExists.Overwrite, true);
        //    }
        //    return path;
        //}
        ////HaiTX delete file FTP
        //public static async ValueTask<bool> DeleteDocumentStaticFTP(string filePath, string rootPath = "")
        //{
        //    try
        //    {
        //        using (var ftp = new AsyncFtpClient(Utility.SysVariable.Get("STORAGEURI"), Utility.SysVariable.Get("STORAGEUSER"), Utility.SysVariable.Get("STORAGEPASS")))
        //        {
        //            var token = new CancellationToken();
        //            await ftp.Connect(token);
        //            string fullPath = Path.Combine(rootPath, filePath).Replace(@"\", "/");
        //            bool fileExists = await ftp.FileExists(fullPath);
        //            if (fileExists)
        //            {
        //                await ftp.DeleteFile(fullPath);
        //                return true;
        //            }
        //            else
        //            {
        //                return false;
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine($"Error deleting file from FTP: {ex.Message}");
        //        return false; // File deletion failed
        //    }
        //}
    }
}
