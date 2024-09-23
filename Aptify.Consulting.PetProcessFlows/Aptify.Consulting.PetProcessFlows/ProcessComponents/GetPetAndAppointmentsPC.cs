using Aptify.Consulting.PetProcessFlows.Utilities;
using Aptify.Framework.Application;
using Aptify.Framework.BusinessLogic.GenericEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Text;
using Newtonsoft.Json;
using static Aptify.Consulting.PetProcessFlows.GetPetAndAppointmentsPC;

namespace Aptify.Consulting.PetProcessFlows
{
    public class GetPetAndAppointmentsPC : Aptify.Framework.BusinessLogic.ProcessPipeline.ProcessComponentBase
    {
        #region Globals
        public const string petInfoOutput = "PetInfoOutput";
        protected enum ResultCodes { SUCCESS, FAILURE };
        #endregion

        #region Properties
        protected virtual long PetId()
        {
            var petIdObject = Properties["petId"] ?? -1;
            return Methods.SafeLong(petIdObject);
        }

        protected virtual long OwnerId()
        {
            var ownerIdObject = Properties["ownerId"] ?? throw new ArgumentNullException("ownerId");
            return Methods.SafeLong(ownerIdObject);
        }
        #endregion

        #region MainMethods
        public override string Run()
        {
            ResultCodes ReturnedCode = ResultCodes.SUCCESS;

            try
            {
                List<PetInfo> petInfo = new List<PetInfo>();
                DataSet petInfoDataSet = GetPetInfoAndAppointments(PetId(), OwnerId());

                if (petInfoDataSet != null)
                {
                    // add all pet info
                    foreach (DataRow singlePet in petInfoDataSet.Tables[0].Rows)
                    {
                        petInfo.Add(new PetInfo()
                        {
                            Id = Methods.SafeInt(singlePet["ID"]),
                            Name = Methods.SafeString(singlePet["Name"]),
                            OwnerId = Methods.SafeInt(singlePet["OwnerID"]),
                            Owner = Methods.SafeString(singlePet["Owner"]),
                            AnimalSizeId = Methods.SafeInt(singlePet["AnimalSizeID"]),
                            AnimalSize = Methods.SafeString(singlePet["AnimalSize"]),
                            PetBreedId = Methods.SafeInt(singlePet["PetBreedID"]),
                            PetBreed = Methods.SafeString(  singlePet["PetBreed"]),
                            AnimalTypeId = Methods.SafeInt(singlePet["AnimalTypeID"]),
                            AnimalType = Methods.SafeString(singlePet["AnimalType"]),
                            AnimalGroup = Methods.SafeString(singlePet["AnimalGroup"])
                        });
                    }

                    // add all appointments
                    foreach (DataRow singleAppointment in petInfoDataSet.Tables[1].Rows)
                    {
                        var petId = Methods.SafeInt(singleAppointment["PetID"]);

                        var foundPetInfo = petInfo.Find(x => x.Id == petId);

                        foundPetInfo.Appointments.Add(new PetAppointment()
                        {
                            Id = Methods.SafeInt(singleAppointment["ID"]),
                            PetId = petId,
                            PetName = Methods.SafeString(singleAppointment["PetName"]),
                            AppointmentType = Methods.SafeString(singleAppointment["AppointmentType"]),
                            AppointmentDate = Methods.SafeDateTime(singleAppointment["AppointmentDate"]),
                            Comments = Methods.SafeString(singleAppointment["Comments"])
                        });
                    }

                    Properties[petInfoOutput] = GetResponse(petInfo);
                }
                else
                {
                    throw new Exception("Unable to find pet with Id");
                }
            }
            catch (Exception e)
            {
                Aptify.Framework.ExceptionManagement.ExceptionManager.Publish(e);
                ReturnedCode = ResultCodes.FAILURE;
            }

            return ReturnedCode.ToString();
        }
        #endregion

        #region HelperMethods
        /// <summary>
        /// Sample call to a stored procedure
        /// </summary>
        /// <returns>datatable with data</returns>
        private DataSet GetPetInfoAndAppointments(long petId, long ownerId)
        {
            string SQL = "spGeteBusiness6_0GetPetInfoAndAppointments__c";
            IDataParameter[] myParams = new IDataParameter[2];

            myParams[0] = DataAction.GetDataParameter("PetID", System.Data.SqlDbType.Int, petId);
            myParams[1] = DataAction.GetDataParameter("OwnerID", System.Data.SqlDbType.Int, ownerId);

            return DataAction.GetDataSetParametrized(SQL, CommandType.StoredProcedure, myParams);
        }

        public virtual HttpResponseMessage GetResponse(List<PetInfo> petInfo)
        {
            HttpResponseMessage result = new HttpResponseMessage();
            result.StatusCode = HttpStatusCode.OK;
            result.Content = new StringContent(JsonConvert.SerializeObject(petInfo), Encoding.UTF8, "application/json");
            return result;
        }

        public class PetInfo
        {
            public int Id;
            public string Name;
            public int OwnerId;
            public string Owner;
            public int AnimalSizeId;
            public string AnimalSize;
            public int PetBreedId;
            public string PetBreed;
            public int AnimalTypeId;
            public string AnimalType;
            public string AnimalGroup;
            public List<PetAppointment> Appointments;

            public PetInfo() {
                Appointments = new List<PetAppointment>();
            }            
        }

        public class PetAppointment
        {
            public int Id;
            public int PetId;
            public string PetName;
            public string AppointmentType;
            public DateTime AppointmentDate;
            public string Comments;
        }
        #endregion
    }
}