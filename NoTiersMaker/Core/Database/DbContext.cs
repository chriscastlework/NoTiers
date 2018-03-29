using System.Data.Entity;
using CustomLogic.Core.Interfaces;

// You must add entiyframework nuget

namespace CustomLogic.Core.Database
{
    
    /// <summary>
    /// Use all the classes from the reverse code first but this is faster as we dotn make such a large context
    /// You may need to duplicate this class when dealing with multiple database this has currently not been though about
    /// </summary>
    public class VelocityRocketLegacy : DbContext , IUnitOfWork
    {
        public VelocityRocketLegacy()
            : base("name=VelocityRocketConnectionString")
        {
            System.Data.Entity.Database.SetInitializer<VelocityRocketLegacy>(null);
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.AddFromAssembly(GetType().Assembly); // this is the magic add everything with a map
        }

        public IDbSet<T> With<T>() where T : class
        {
            return Set<T>();
        }
        
        public static VelocityRocketLegacy Create()
        {
            return new VelocityRocketLegacy();
        }
    }
}

