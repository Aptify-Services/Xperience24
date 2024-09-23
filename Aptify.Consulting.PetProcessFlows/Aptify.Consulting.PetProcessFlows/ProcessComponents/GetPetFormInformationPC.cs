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

namespace Aptify.Consulting.PetProcessFlows
{
    public class GetPetFormInformationPC : Aptify.Framework.BusinessLogic.ProcessPipeline.ProcessComponentBase
    {
        #region Globals
        public const string petInformationOutput = "PetInformationOutput";
        protected enum ResultCodes { SUCCESS, FAILURE };
        #endregion

        #region Properties
        #endregion

        #region MainMethods
        public override string Run()
        {
            ResultCodes ReturnedCode = ResultCodes.SUCCESS;

            try
            {
                PetFormInformation petFormInfo = new PetFormInformation();
                DataSet petInfoDataSet = GetPetFormInformation();

                if (petInfoDataSet != null)
                {
                    // add all pet info
                    foreach (DataRow singleBreed in petInfoDataSet.Tables[0].Rows)
                    {
                        petFormInfo.petBreeds.Add(new PetBreed()
                        {
                            Id = Methods.SafeInt(singleBreed["ID"]),
                            Name = Methods.SafeString(singleBreed["Name"])
                        });
                    }

                    foreach (DataRow singleGroup in petInfoDataSet.Tables[1].Rows)
                    {
                        petFormInfo.animalGroups.Add(new AnimalGroup()
                        {
                            Id = Methods.SafeInt(singleGroup["ID"]),
                            Name = Methods.SafeString(singleGroup["Name"])
                        });
                    }

                    foreach (DataRow singleSize in petInfoDataSet.Tables[2].Rows)
                    {
                        petFormInfo.animalSizes.Add(new AnimalSize()
                        {
                            Id = Methods.SafeInt(singleSize["ID"]),
                            Name = Methods.SafeString(singleSize["Name"])
                        });
                    }

                    foreach (DataRow singleType in petInfoDataSet.Tables[3].Rows)
                    {
                        petFormInfo.animalTypes.Add(new AnimalType()
                        {
                            Id = Methods.SafeInt(singleType["ID"]),
                            Name = Methods.SafeString(singleType["Name"]),
                            AnimalGroupId = Methods.SafeInt(singleType["AnimalGroupID"])
                        });
                    }

                    Properties[petInformationOutput] = GetResponse(petFormInfo);
                }
                else
                {
                    throw new Exception("Unable to pull data with spGeteBusiness6_0GetPetFormInformation__c");
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
        private DataSet GetPetFormInformation()
        {
            string SQL = "spGeteBusiness6_0GetPetFormInformation__c";
            return DataAction.GetDataSet(SQL);
        }

        public virtual HttpResponseMessage GetResponse(PetFormInformation petFormInfo)
        {
            HttpResponseMessage result = new HttpResponseMessage();
            result.StatusCode = HttpStatusCode.OK;
            result.Content = new StringContent(JsonConvert.SerializeObject(petFormInfo), Encoding.UTF8, "application/json");
            return result;
        }

        public class PetBreed
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
        public class AnimalGroup
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
        public class AnimalSize
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }
        public class AnimalType
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public int AnimalGroupId { get; set; }
        }

        public class PetFormInformation
        {
            public List<PetBreed> petBreeds { get; set; }
            public List<AnimalGroup> animalGroups { get; set; }
            public List<AnimalSize> animalSizes { get; set; }
            public List<AnimalType> animalTypes { get; set; }

            public PetFormInformation()
            {
                petBreeds = new List<PetBreed>();
                animalGroups = new List<AnimalGroup>();
                animalSizes = new List<AnimalSize>();
                animalTypes = new List<AnimalType>();
            }
        }
        #endregion
    }
}