using Xxx.AngularJsSolution1.Data.Mapping;
using Xxx.AngularJsSolution1.Objects.Entities;
using Repository.Pattern.Ef6;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xxx.AngularJsSolution1.Data
{
    public class SimpleOrderEntryContext : DataContext
    {
        static SimpleOrderEntryContext()
        {
            var rebuildDb = ConfigurationManager.AppSettings["RebuildDB"];
            Database.SetInitializer<SimpleOrderEntryContext>(null);
        }

        public SimpleOrderEntryContext()
            : base("Name=SimpleOrderEntryContext")
        {
        }

        public DbSet<Order> Orders { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Configurations.Add(new OrderMap());
        }
    }
}
