using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Microsoft.ServiceBus;
using Microsoft.ServiceBus.Messaging;

namespace AzureSSS.Models
{
    [Serializable]
    public class MessageText
    {
        public string msgT { get; set; }
    }


    public static class ServiceBusQ
    {
        public static IHandleQ DataHandler { get; set; }

        // Thread-safe. Recommended that you cache rather than recreating it
        // on every request.
        public static QueueClient QueueClient;

        // Obtain these values from the portal.
        public const string Namespace = "SSSEventHub-ns";

        // The name of your queue.
        public const string QueueName = "MyMessageQ";

        public static void sendmsg(string mssg)
        {
            // Create a message from the order.
            var msg = new MessageText() { msgT = mssg };


            //string strMsg = JsonConvert.SerializeObject(omsg);
            //BrokeredMessage msg = new BrokeredMessage(new MemoryStream(UTF8Encoding.UTF8.GetBytes(strMsg)));
            var message = new BrokeredMessage(msg);

            // Submit the order.
            QueueClient.Send(message);

        }


        public static NamespaceManager CreateNamespaceManager()
        {
            // Create the namespace manager which gives you access to
            // management operations.
            var uri = ServiceBusEnvironment.CreateServiceUri(
                "sb", Namespace, String.Empty);
            var tP = TokenProvider.CreateSharedAccessSignatureTokenProvider(
                "RootManageSharedAccessKey", "yfLFmOQotDCLFcIWtrI3LlLzbqr3+l7K+HUbWluiz28=");
            return new NamespaceManager(uri, tP);
        }

        public static void Initialize()
        {

            // Using Http to be friendly with outbound firewalls.
            ServiceBusEnvironment.SystemConnectivity.Mode =
                ConnectivityMode.Http;

            // Create the namespace manager which gives you access to
            // management operations.
            var namespaceManager = CreateNamespaceManager();

            //string connString = ConfigurationSettings.AppSettings["Microsoft.ServiceBus.ConnectionString"];
            //QueueClient = QueueClient.CreateFromConnectionString(connString, QueueName);


            // Create the queue if it does not exist already.
            if (!namespaceManager.QueueExists(QueueName))
            {
                namespaceManager.CreateQueue(QueueName);
            }

            // Get a client to the queue.
            var messagingFactory = MessagingFactory.Create(
                namespaceManager.Address,
                namespaceManager.Settings.TokenProvider);
            QueueClient = messagingFactory.CreateQueueClient(
                QueueName);

            if (QueueClient != null)
                RegisterOnMessageHandlerAndReceiveMessages();
        }


        public static void RegisterOnMessageHandlerAndReceiveMessages()
        {
            // Configure the MessageHandler Options in terms of exception handling, number of concurrent messages to deliver etc.
            var options = new OnMessageOptions();
            // Indicates whether MessagePump should automatically complete the messages after returning from User Callback.
            // False below indicates the Complete will be handled by the User Callback as in `ProcessMessagesAsync` below.
            options.AutoComplete = true; // Indicates if the message-pump should call complete on messages after the callback has completed processing.
            // Maximum number of Concurrent calls to the callback `ProcessMessagesAsync`, set to 1 for simplicity.
            // Set it according to how many messages the application wants to process in parallel.
            options.MaxConcurrentCalls = 1; // Indicates the maximum number of concurrent calls to the callback the pump should initiate 
            options.ExceptionReceived += LogErrors; // Allows users to get notified of any errors encountered by the message pump


            // Register the function that will process messages
            QueueClient.OnMessageAsync(ProcessMessagesAsync, options);
        }

        private static void LogErrors(object sender, ExceptionReceivedEventArgs e)
        {
            if (e.Exception != null)
            {
                if (e.Exception is MessagingEntityDisabledException)
                    Console.WriteLine($"Queue is locked {e.Exception.Message}");
                else if (e.Exception is MessagingEntityNotFoundException)
                    Console.WriteLine($"Queue disappeared {e.Exception.Message}");
                else if (e.Exception is MessagingCommunicationException)
                    Console.WriteLine($"Queue connection problem {e.Exception.Message}");
                else
                    Console.WriteLine($"Queue something wrong {e.Exception.Message}");


                var lst = DataHandler.GetQ();
                lst.Add("EXCEPTION MSG=" + e.Exception.Message);
            }
        }

        static async Task ProcessMessagesAsync(BrokeredMessage message)
        {
            var msg = message.GetBody<MessageText>().msgT;
            // Process the message
            Console.WriteLine(
                $"Received message: SequenceNumber:{message.SequenceNumber} Body:{msg}");

            var lst = DataHandler.GetQ();
            lst.Add(msg);
            // Complete the message so that it is not received again.
            // This can be done only if the queueClient is created in ReceiveMode.PeekLock mode (which is default).
            //await QueueConnector.OrdersQueueClient.CompleteAsync(message.LockToken);

        }



    }
}
