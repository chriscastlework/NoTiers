using System;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Tests.IntegrationTests
{
    public class VrTestBase : IDisposable
    {
        public VelocityRocketLegacyContext Db { get; set; }

        public VrTestBase()
        {
            Db = new VelocityRocketLegacyContext();
            Clean();
        }

        public void Dispose()
        {
            Clean();
        }

        private void Clean()
        {
            // If any test fail you might have to manually runs these
            Db.Database.ExecuteSqlCommand("delete from Accounts where Id >= 61950");
            Db.Database.ExecuteSqlCommand("delete from Deals where Id >= 83547");
            Db.Database.ExecuteSqlCommand("delete from TaskTypes where Id >= 26614");
            Db.Database.ExecuteSqlCommand("delete from Tasks where Id >= 138427");
            Db.Database.ExecuteSqlCommand("delete from Contacts where Id >= 144445");
            Db.Database.ExecuteSqlCommand("delete from Users where PasswordHash is null");
            Db.Database.ExecuteSqlCommand("delete from CustomFields where Id >= 7393");
            Db.Database.ExecuteSqlCommand("delete from CustomFieldValues where EntityId = 1000000 or EntityId = 1000001 or EntityId = 1000002 or EntityId = 1000003 or EntityId = 1000004");
        }
    }
}