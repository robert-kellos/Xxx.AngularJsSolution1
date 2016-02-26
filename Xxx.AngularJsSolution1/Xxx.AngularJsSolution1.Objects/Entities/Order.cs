using System;
using System.Collections.Generic;

namespace Xxx.AngularJsSolution1.Objects.Entities
{
    public class Order :  Repository.Pattern.Ef6.AuditableEntity<long>
    {
        //public int ID { get; set; } //--> within Base Entity class of all Entities
        public string OrderData { get; set; }
        public int Version { get; set; }
    }
}
