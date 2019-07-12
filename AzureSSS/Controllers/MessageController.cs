using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Threading;
using AzureSSS.Models;
using System.Text;

namespace AzureSSS.Controllers
{
    [RoutePrefix("api/message")]
    public class MessageController : ApiController
    {
        static readonly object _object = new object();
        IHandleQ DataHandleQ = new HandleQ();
        private static int totalvals = 12;

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> Get()
        {
            try
            {
                var lst = DataHandleQ.GetQ();
                return this.Ok(lst.Count);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("count")]
        public async Task<IHttpActionResult> Count()
        {
            try
            {
                var lst = DataHandleQ.GetQ();
                return this.Ok(lst.Count);
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("lazy")]
        public async Task<IHttpActionResult> Lazy()
        {
            try
            {
                var sb = new StringBuilder();
                for (int i = 1; i < totalvals; i++)
                {
                    sb.Append($"<option value=\"{i}\">value {i}</option>");
                }
                totalvals += 6;
                return this.Ok(sb.ToString());
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("lazy2")]
        public async Task<IHttpActionResult> Lazy2(int vstart, int vstop)
        {
            //"[{ "Name":"test1", "addr":"101 addr", "salary":113000 }{ "Name":"test2", "addr":"102 addr", "salary":114000 }{ "Name":"test3", "addr":"103 addr", "salary":115000 }{ "Name":"test4", "addr":"104 addr", "salary":116000 }{ "Name":"test5", "addr":"105 addr", "salary":117000 }{ "Name":"test6", "addr":"106 addr", "salary":118000 }{ "Name":"test7", "addr":"107 addr", "salary":119000 }{ "Name":"test8", "addr":"108 addr", "salary":120000 }{ "Name":"test9", "addr":"109 addr", "salary":121000 }{ "Name":"test10", "addr":"110 addr", "salary":122000 }{ "Name":"test11", "addr":"111 addr", "salary":123000 }]"
            try
            {
                var sb = new StringBuilder();
                sb.Append("[");
                for (int i = vstart; i < totalvals; i++)
                {
                    if (i != vstart) sb.Append(",");
                    sb.Append($"{{ \"Name\":\"{"test" + i}\", \"addr\":\"{(100+i) + " addr"}\", \"salary\":{112000+(i*1000)} }}");
                }
                sb.Append("]");
                return this.Ok(sb.ToString());
            }
            catch (Exception ex)
            {
                return this.BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("")]
        public async Task<HttpResponseMessage> Get(string msgText)
        {
            try
            {
                // HttpContext.Current.Request.QueryString
                //            var value = this.Request.GetQueryNameValuePairs().Where(m => m.Key == "msgId").SingleOrDefault().Value;

                var lstMessage = await this.GetMessage();

                if (lstMessage == null)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound);
                }

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, new {Messages = lstMessage});
                return response;
                //            return this.Ok(lstMessage);
            }
            catch (Exception ex)
            {
                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.InternalServerError, new { Messages = ex.Message });
                return response;
            }

        }

        [Route("")]
        [HttpPut]
        [System.Web.Http.AcceptVerbs("PUT")]
        //        public async Task<IHttpActionResult> Put(string msgText)
        public async Task Put([FromBody] MessageText msg)
        {
            await this.AddMessage(msg.msgT);

        }

        private async Task<List<string>> GetMessage()
        {
            Monitor.Enter(_object);
            try
            {
                return DataHandleQ.GetQ();
            }
            finally
            {
                Monitor.Exit(_object);
            }

            return null;
        }

        private async Task AddMessage(string msg)
        {
            //Monitor.Enter(_object);
            try
            {
                //var lst = DataHandleQ.GetQ();
                //lst.Add(msg);
                ServiceBusQ.sendmsg(msg);
                //Thread.Sleep(500);
            }
            finally
            {
               // Monitor.Exit(_object);
            }
        }

    }
}
