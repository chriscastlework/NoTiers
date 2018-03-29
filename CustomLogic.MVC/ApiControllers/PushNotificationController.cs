using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.Caching;
using System.Web.Http;
using Newtonsoft.Json;
using WebPush;

namespace CustomLogic.MVC.ApiControllers
{
    public class SubscribeUserController : ApiController
    {

        [HttpPost]
        public HttpResponseMessage Post(RootObject model)
        {
           
            ObjectCache cache = MemoryCache.Default;
            List<RootObject> fileContents = cache["subscriptions"] as List<RootObject>;
            if (fileContents == null)
            { 
                List<RootObject> newCache = new List<RootObject>();
                newCache.Add(model);
                cache["subscriptions"] = newCache;
            }
            else
            {
                fileContents.Add(model);
                cache["subscriptions"] = fileContents;
            }
            return  new HttpResponseMessage(HttpStatusCode.OK);
        }
    }

    public class UnSubscribeUserController : ApiController
    {

        [HttpPost]
        public HttpResponseMessage Post(RootObject model)
        {
            ObjectCache cache = MemoryCache.Default;
            List<RootObject> fileContents = cache["subscriptions"] as List<RootObject>;
            if (fileContents != null)
            {
                var item =
                    fileContents.FirstOrDefault(
                        c => c.keys.auth == model.keys.auth && c.keys.p256dh == model.keys.p256dh);

                if (item != null)
                {

                    fileContents.Remove(item);
                    cache["subscriptions"] = fileContents;
                }
            }
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }

    public class PostSubscribeUserController : ApiController
    {

        [HttpPost]
        public HttpResponseMessage Post(RootObject model)
        {
            try
            {

                //Public Key = BKspSxcxttPOItpMuw2EenS8YKgeDxd8LIaJFfcZl5O5TcfXz5cN_3_nTgPZ79a5ORP4E-d65NtXytWqwUZ68hA
                // Private Key = wDbvxPB53d0lLJgj2DpG792tTJ5yneZNXOlyky79P8Q



                var vapidDetails = new VapidDetails(
               @"mailto:admin@notiers.com",
               "BKspSxcxttPOItpMuw2EenS8YKgeDxd8LIaJFfcZl5O5TcfXz5cN_3_nTgPZ79a5ORP4E-d65NtXytWqwUZ68hA",
               "wDbvxPB53d0lLJgj2DpG792tTJ5yneZNXOlyky79P8Q"
               );

                ObjectCache cache = MemoryCache.Default;
                List<RootObject> fileContents = cache["subscriptions"] as List<RootObject>;

                var webPushClient = new WebPushClient();
                if (model == null)
                {
                    model = new RootObject();
                }
                model.endpoint = "skdjhvbsdkjv Check me";
                var payload = JsonConvert.SerializeObject(model);

                foreach (var subscription in fileContents)
                {
                    webPushClient.SendNotification(
                        new PushSubscription(subscription.endpoint, subscription.keys.p256dh, subscription.keys.auth),
                        payload,
                        vapidDetails);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
           
           
            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }

}
public class Keys
{
    public string p256dh { get; set; }
    public string auth { get; set; }
}

public class RootObject
{
    public string endpoint { get; set; }
    public object expirationTime { get; set; }
    public Keys keys { get; set; }
}
