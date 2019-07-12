using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AzureSSS.Models.Quiz;
using System.Data.SqlClient;

namespace AzureSSS.Controllers
{
    public class TriviaController : ApiController
    {
        private TriviaContext db = new TriviaContext();
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this.db.Dispose();
            }

            base.Dispose(disposing);
        }

        private async Task<TriviaQuestion> NextQuestionAsync(string userId)
        {
            var lastQ= this.db.TriviaAnswers;

            var lastQuestionId = await this.db.TriviaAnswers
                .Where(a => a.UserId == userId)
                .GroupBy(a => a.QuestionId)
                .Select(g => new { QuestionId = g.Key, Count = g.Count() })
                .OrderByDescending(q => new { q.Count, QuestionId = q.QuestionId })
                .Select(q => q.QuestionId)
                .FirstOrDefaultAsync();

            var questionsCount = await this.db.TriviaQuestions.CountAsync();

            var nextQuestionId = (lastQuestionId % questionsCount) + 1;
            return await this.db.TriviaQuestions.FindAsync(CancellationToken.None, nextQuestionId);
        }

        private async Task<bool> StoreAsync(TriviaAnswer answer)
        {
            this.db.TriviaAnswers.Add(answer);

            await this.db.SaveChangesAsync();
            var selectedOption = await this.db.TriviaOptions.FirstOrDefaultAsync(o => o.Id == answer.OptionId
                && o.QuestionId == answer.QuestionId);

            return selectedOption.IsCorrect;
        }

        [ResponseType(typeof(TriviaQuestion))]
        public async Task<IHttpActionResult> Get()
        {
            var userId = User.Identity.Name;
            userId = "jschuebel";


            //try
            //{

            //    using (SqlConnection connection = new SqlConnection("tcp:f25y9q8phy.database.windows.net,1433;Initial Catalog=ssstest1db;Persist Security Info=False;User ID=jschuebel;Password=Weebjs56;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"))
            //    {
            //        Console.WriteLine("\nQuery data example:");
            //        Console.WriteLine("=========================================\n");

            //        connection.Open();

            //        using (SqlCommand command = new SqlCommand("select * from TriviaQuestion", connection))
            //        {
            //            using (SqlDataReader reader = command.ExecuteReader())
            //            {
            //                while (reader.Read())
            //                {
            //                    Console.WriteLine("{0} {1}", reader.GetString(0), reader.GetString(1));
            //                }
            //            }
            //        }
            //    }
            //}
            //catch (SqlException e)
            //{
            //    Console.WriteLine(e.ToString());
            //}




            TriviaQuestion nextQuestion = await this.NextQuestionAsync(userId);

            if (nextQuestion == null)
            {
                return this.NotFound();
            }

            return this.Ok(nextQuestion);
        }

        [ResponseType(typeof(TriviaAnswer))]
        public async Task<IHttpActionResult> Post(TriviaAnswer answer)
        {
            if (!ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            answer.UserId = User.Identity.Name;
            answer.UserId = "jschuebel";
            var isCorrect = await this.StoreAsync(answer);
            return this.Ok<bool>(isCorrect);
        }

    }
}
