namespace Modelo.Entity
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;

    public partial class Model : DbContext
    {
        public Model()
            : base("name=ModelContext")
        {
        }

        public virtual DbSet<TbCliente> TbCliente { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TbCliente>()
                .Property(e => e.NomeCliente)
                .IsUnicode(false);

            modelBuilder.Entity<TbCliente>()
                .Property(e => e.CodigoCliente)
                .IsUnicode(false);
        }
    }
}
