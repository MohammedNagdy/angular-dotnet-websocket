using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class ChattingHub : Hub
    {
        public Task SendToAll(string message)
        {
            Console.WriteLine("Message Sent");
            return Clients.All.SendAsync("SendToAll", message);
        }

        public Task JoinGroup(string groupId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId ,groupId);
        }

        public Task SendToGroup(string groupId, string message)
        {
            Console.WriteLine("Message Sent Group");
            return Clients.Group(groupId).SendAsync("SendToGroup", message);
        }

        // Override the user connect and disconnect methods in IHub
        public override async Task OnConnectedAsync()
        {
            // await Clients.All.
            await base.OnConnectedAsync();
        }

         public override async Task OnDisconnectedAsync(Exception ex)
        {
            await base.OnDisconnectedAsync(ex);
        }
    }
}