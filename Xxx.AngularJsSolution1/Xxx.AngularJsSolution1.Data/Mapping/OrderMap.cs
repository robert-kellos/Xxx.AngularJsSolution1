using Xxx.AngularJsSolution1.Objects.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace Xxx.AngularJsSolution1.Data.Mapping
{
    public class OrderMap : EntityTypeConfiguration<Order>
    {
        public OrderMap()
        {
            // Primary Key
            this.HasKey(t => t.Id);

            // Properties
            this.Property(t => t.OrderData)
                .IsRequired();

            // Table & Column Mappings
            this.ToTable("Orders");
            this.Property(t => t.Id).HasColumnName("ID");
            this.Property(t => t.OrderData).HasColumnName("OrderData");
            this.Property(t => t.Version).HasColumnName("Version");
        }
    }

    //public class OrderMap : EntityTypeConfiguration<Order>
    //{
    //    public OrderMap()
    //    {
    //        // Primary Key
    //        this.HasKey(t => t.Id);

    //        // Properties
    //        this.Property(t => t.OrderData)
    //            .IsRequired();

    //        // Table & Column Mappings
    //        this.ToTable("Orders");
    //        this.Property(t => t.Id).HasColumnName("ID");
    //        this.Property(t => t.OrderData).HasColumnName("OrderData");
    //        this.Property(t => t.Version).HasColumnName("Version");
    //    }
    //}
}
