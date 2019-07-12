using System;
using System.Collections.Generic;
using System.Runtime.Caching;

namespace AzureSSS.Models
{
    public class HandleQ : IHandleQ
    {
        MemoryCache memCache = MemoryCache.Default;

        public List<string> GetQ()
        {
            if (!memCache.Contains("tag"))
                memCache.Add("tag", new List<string>(), DateTimeOffset.UtcNow.AddMinutes(15));
            return memCache.Get("tag") as List<string>;
        }
    }
}