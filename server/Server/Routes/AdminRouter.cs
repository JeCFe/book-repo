using Server.Domain.Commands.Admin;

namespace Server.Routes;

public static class AdminEndpoints
{
    public static RouteGroupBuilder MapAdminEndpoints(this RouteGroupBuilder group)
    {
        group.MapPost(
            "/add-contributor-trophy",
            CommandExecutor.Execute<AddContributorTrophyCommand>
        );
        group.MapPost("/update-book-error", CommandExecutor.Execute<UpdateBookErrorCommand>);
        group.MapPost("/close-book-error", CommandExecutor.Execute<CloseBookErrorCommand>);
        group.MapPost("/complete-book-error", CommandExecutor.Execute<CompletedBookErrorCommand>);
        return group;
    }
}
