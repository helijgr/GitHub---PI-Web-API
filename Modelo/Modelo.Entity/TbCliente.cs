namespace Modelo.Entity
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("TbCliente")]
    public partial class TbCliente
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string NomeCliente { get; set; }

        [Required]
        [StringLength(50)]
        public string CodigoCliente { get; set; }

        public DateTime DataCriacaoCliente { get; set; }
    }
}
