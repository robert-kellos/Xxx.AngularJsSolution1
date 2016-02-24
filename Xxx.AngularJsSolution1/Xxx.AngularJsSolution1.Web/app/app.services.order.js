(function () {
    'use strict';
    angular.module('app')
    .factory('ordersService', ['_', '$http', 'ngUrlSettings', ordersService]);

    function ordersService(_, $http, ngUrlSettings) {

        var serviceBase = ngUrlSettings.apiResourceServer
        var endPointUrl = serviceBase + 'api/orders/activeOrders';
        var exports = {};

        var _getNewOrder = function () {
            return $http.get('/app/data/newOrder.json').then(function (results) {
                return results;
            });
        };
        var _getActiveOrders = function (pagingInfo) {
            return $http.get(endPointUrl, { params: pagingInfo }).then(function (results) {
                return results;
            });
        };
        var _getOrderById = function (orderId) {
            return order;
        };

        var _findProducts = function (query) {
            return $http.get('/app/data/products.json').success(function (results) {
                return results;
            });
        };
        var _findAccountExecutives = function (query) {
            return $http.get('/app/data/accountExecutives.json').success(function (results) {
                return results;
            });
        };
        var _findSellers = function (query) {
            return $http.get('/app/data/sellers.json').success(function (results) {
                return results;
            });
        };
        var _findStation = function (query) {
            return $http.get('/app/data/stations.json').success(function (results) {
            
                var stations = results.data;

                var filteredStations = _.filter(stations, function (station) {
                    return ~station.FCCCallLetters.toLowerCase().indexOf(query.toLowerCase());
                });

                if (filteredStations && filteredStations.length == 1)
                    results.data = filteredStations[0];

                return results;

            });
        };
        var _findAdvertisers = function (query) {
            return $http.get('/app/data/advertisers.json').success(function (results) {
                return results;
            });
        };
        var _findAgencies = function (query) {
            return $http.get('/app/data/agencies.json').success(function (results) {
                return results;
            });
        };

        var _order = {
            "OrderId": "AGCY12345_2007",
            "OrderVersion": 1,
            "OrderStatus": "New",
            "OrderIdReferences": [
              {
                  "source": "Agency",
                  "sourceDescription": null,
                  "Value": "AGCY12345_2007"
              },
              {
                  "source": "Station",
                  "sourceDescription": null,
                  "Value": "1524"
              }
            ],
            "TypeOfOrder": "Normal",
            "OrderCashTrade": "Cash",
            "Advertiser": {
                "CompanyName": "Acme Widget, Inc.",
                "Addresses": [
                  {
                      "AddressBlockLine": null,
                      "City": "AnyTown",
                      "CountryCode": "USA",
                      "PostalCode": "11111-2222",
                      "RegionCode": "NY",
                      "Street1": "15 Oak St. Suite 1300",
                      "Street2": null,
                      "Street3": null,
                      "AddressRole": "Business"
                  }
                ],
                "Contacts": [
                  {
                      "PersonPrefix": "Mr.",
                      "PersonFirstName": "Robert",
                      "PersonMiddleInitial": null,
                      "PersonLastName": "Washington",
                      "PersonSuffix": null,
                      "PersonTitle": "VP MArketing",
                      "Email": [
                        "acustomer@example.com"
                      ],
                      "Phone": [
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551212",
                            "PhoneExtension": null,
                            "phoneLocation": "Office",
                            "phoneType": "Voice"
                        }
                      ],
                      "SourceCode": [
                        {
                            "source": "Agency",
                            "sourceDescription": null,
                            "Value": "AGY_CON_001"
                        }
                      ],
                      "ContactId": "PS0",
                      "ContactRole": "Buyer"
                  }
                ],
                "SourceCodes": [
                  {
                      "source": "Agency",
                      "sourceDescription": null,
                      "Value": "ADV_001"
                  }
                ],
                "DUNSNumber": 101010101
            },
            "Product": {
                "ProductName": "Our Finest Widgets",
                "SourceCode": [
                  {
                      "source": "Agency",
                      "sourceDescription": null,
                      "Value": "WIDGET"
                  }
                ]
            },
            "PiggybackProduct": {
                "ProductName": "Our Finest Widgets Accessories",
                "SourceCode": [
                  {
                      "source": "Advertiser",
                      "sourceDescription": null,
                      "Value": "WIDGET_ADDON"
                  }
                ]
            },
            "Agency": {
                "Office": {
                    "OfficeName": "New York Sales",
                    "Phone": [
                      {
                          "CountryAccessCode": "1",
                          "AreaCityCode": "212",
                          "PhoneNumber": "5551000",
                          "PhoneExtension": null,
                          "phoneLocation": "Office",
                          "phoneType": "Voice"
                      }
                    ],
                    "Addresses": [
                      {
                          "AddressBlockLine": null,
                          "City": "New York",
                          "CountryCode": "USA",
                          "PostalCode": "10174-1801",
                          "RegionCode": "NY",
                          "Street1": "405 Lexington Ave 18th Fl",
                          "Street2": null,
                          "Street3": null,
                          "AddressRole": "Billing"
                      }
                    ],
                    "SourceCode": [
                      {
                          "source": "Agency",
                          "sourceDescription": null,
                          "Value": "AGY_OFF_001"
                      }
                    ],
                    "LocationCode": "101"
                },
                "TradingPartnerId": null,
                "CompanyName": "AAAA Advertising Agency, Inc.",
                "Addresses": [
                  {
                      "AddressBlockLine": null,
                      "City": "New York",
                      "CountryCode": "USA",
                      "PostalCode": "10174-1801",
                      "RegionCode": "NY",
                      "Street1": "405 Lexington Ave 18th Fl",
                      "Street2": null,
                      "Street3": null,
                      "AddressRole": "Billing"
                  }
                ],
                "Contacts": [
                  {
                      "PersonPrefix": "Ms.",
                      "PersonFirstName": "Jane",
                      "PersonMiddleInitial": null,
                      "PersonLastName": "Doe",
                      "PersonSuffix": null,
                      "PersonTitle": "Buyer",
                      "Email": [
                        "jdoe@aaaa.org"
                      ],
                      "Phone": [
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551212",
                            "PhoneExtension": "333",
                            "phoneLocation": "Office",
                            "phoneType": "Voice"
                        },
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551213",
                            "PhoneExtension": null,
                            "phoneLocation": "Office",
                            "phoneType": "Fax"
                        }
                      ],
                      "SourceCode": [
                        {
                            "source": "Agency",
                            "sourceDescription": null,
                            "Value": "AGY_CON_002"
                        }
                      ],
                      "ContactId": "PS1",
                      "ContactRole": "Buyer"
                  }
                ],
                "SourceCodes": [
                  {
                      "source": "Agency",
                      "sourceDescription": null,
                      "Value": "AGY_AGY_001"
                  }
                ],
                "DUNSNumber": 202020202
            },
            "Estimate": [
              {
                  "source": "Agency",
                  "sourceDescription": null,
                  "Value": "Q2-2007"
              }
            ],
            "Seller": {
                "Key": 1,
                "Value": {
                    "DUNSNumber": "303030303",
                    "tradingPartnerId": "2F9C0543-71CC-41bc-B7C6-59CD4047C624",
                    "CompanyName": "WAAA-TV",
                    "Addresses": [
                      {
                          "AddressBlockLine": null,
                          "City": "New York",
                          "CountryCode": "USA",
                          "PostalCode": "11111-1010",
                          "RegionCode": "NY",
                          "Street1": "344 Anystreet",
                          "Street2": null,
                          "Street3": null,
                          "AddressRole": "Business"
                      }
                    ],
                    "Contacts": [
                      {
                          "PersonPrefix": "Mr.",
                          "PersonFirstName": "John",
                          "PersonMiddleInitial": null,
                          "PersonLastName": "Doe",
                          "PersonSuffix": null,
                          "PersonTitle": "Local Sales Manager",
                          "Email": [
                            "jdoe@waaaa.org"
                          ],
                          "Phone": [
                            {
                                "CountryAccessCode": "1",
                                "AreaCityCode": "212",
                                "PhoneNumber": "5553111",
                                "PhoneExtension": null,
                                "phoneLocation": "Office",
                                "phoneType": "Voice"
                            }
                          ],
                          "SourceCode": [
                            {
                                "source": "Agency",
                                "sourceDescription": null,
                                "Value": "AGGY_CON_003"
                            }
                          ],
                          "ContactId": "PS2",
                          "ContactRole": "AccountExec"
                      }
                    ],
                    "SourceCodes": [
                      {
                          "source": "Agency",
                          "sourceDescription": null,
                          "Value": "AGY_STA_001"
                      }
                    ]
                }
            },
            "LocalNational": "Local",
            "Station": {
                "FCCCallLetters": "WAAA",
                "SourceCode": [
                  {
                      "source": "Agency",
                      "sourceDescription": null,
                      "Value": "WAAA"
                  }
                ],
                "stationId": null,
                "tradingPartnerId": "2F9C0543-71CC-41bc-B7C6-59CD4047C624"
            },
            "CancelDate": null,
            "StartDate": "2007-03-26T00:00:00",
            "EndDate": "2007-04-29T00:00:00",
            "HiatusPeriods": {
                "HiatusPeriod": [
                  {
                      "StartDate": "2007-04-16T00:00:00",
                      "EndDate": "2007-04-22T00:00:00"
                  }
                ]
            },
            "OrderGrossAmount": 17000.00,
            "BillingCalendar": "Broadcast",
            "BillingCycle": "Monthly",
            "PrimaryDemoCategory": null,
            "DemoCategory": [
              {
                  "DemoGroup": "Adults",
                  "DemoLowerAge": 18,
                  "DemoUpperAge": 49,
                  "demoId": "DM0"
              }
            ],
            "MarketShare": {
                "StationMarketShare": [
                  {
                      "Station": {
                          "FCCCallLetters": "WBBB",
                          "SourceCode": [
                            {
                                "source": "Agency",
                                "sourceDescription": null,
                                "Value": "WBBB"
                            }
                          ],
                          "stationId": null,
                          "tradingPartnerId": null
                      }
                  },
                  {
                      "Station": {
                          "FCCCallLetters": "WAAA",
                          "SourceCode": [
                            {
                                "source": "Agency",
                                "sourceDescription": null,
                                "Value": "WAAA"
                            }
                          ],
                          "stationId": null,
                          "tradingPartnerId": null
                      }
                  }
                ],
                "TotalMarketAmount": 120000.00
            },
            "Comment": [
              {
                  "source": "Agency",
                  "sourceDescription": null,
                  "Value": "This order includes bookends"
              }
            ],
            "TermsOfSale": [],
            "SpotBuylines": [
              {
                  "SpotBuylineType": "Normal",
                  "SpotLength": 30,
                  "BuyerDaypart": "NEWS",
                  "StartDayOfWeek": "Mo",
                  "ContractInterval": [
                    {
                        "MondayValid": true,
                        "TuesdayValid": true,
                        "WednesdayValid": true,
                        "ThursdayValid": true,
                        "FridayValid": true,
                        "SaturdayValid": false,
                        "SundayValid": false,
                        "StartTime": "17:00",
                        "EndTime": "18:00"
                    }
                  ],
                  "WeeklySpotDistributions": [
                    {
                        "SpotPerWeekQuantity": "10",
                        "MondayValid": true,
                        "TuesdayValid": true,
                        "WednesdayValid": true,
                        "ThursdayValid": true,
                        "FridayValid": true,
                        "SaturdayValid": false,
                        "SundayValid": false,
                        "StartDate": "2007-03-26T00:00:00",
                        "EndDate": "2007-04-15T00:00:00"
                    },
                    {
                        "SpotPerWeekQuantity": "10",
                        "MondayValid": true,
                        "TuesdayValid": true,
                        "WednesdayValid": true,
                        "ThursdayValid": true,
                        "FridayValid": true,
                        "SaturdayValid": false,
                        "SundayValid": false,
                        "StartDate": "2007-04-23T00:00:00",
                        "EndDate": "2007-04-29T00:00:00"
                    }
                  ],
                  "DailySpotDistributions": [],
                  "SpotOptions": [
                    {
                        "Key": "Bookend",
                        "Value": {
                            "FirstSpotLength": 15,
                            "SecondSpotLength": 15
                        }
                    }
                  ],
                  "TargetDemoValue": [
                    {
                        "RatingPointValue": 1.9,
                        "ImpressionsValue": null,
                        "DemoId": "DM0"
                    }
                  ],
                  "BuylineIdReferences": [
                    {
                        "source": "Agency",
                        "sourceDescription": null,
                        "Value": "1"
                    }
                  ],
                  "BuylineCashTrade": "Cash",
                  "BuylineDescription": "5-6p Local News",
                  "StartDate": "2007-03-26T00:00:00",
                  "EndDate": "2007-04-29T00:00:00",
                  "BuylineQuantity": {
                      "unitType": "Spot",
                      "Value": "40"
                  },
                  "BuylineUnitRate": {
                      "Value": 200.00,
                      "CostModel": "Unit"
                  },
                  "BuylineGrossAmount": 8000.00,
                  "Comment": [
                    {
                        "source": "Agency",
                        "sourceDescription": null,
                        "Value": "This item is for bookends.  Make sure you get the material in the correct sequence."
                    }
                  ],
                  "CancelDate": null,
                  "BuylineNumber": 1,
                  "BuylineVersion": 1,
                  "BuylineStatus": "New"
              },
              {
                  "SpotBuylineType": "Normal",
                  "SpotLength": 30,
                  "BuyerDaypart": "NEWS",
                  "StartDayOfWeek": "Mo",
                  "ContractInterval": [
                    {
                        "MondayValid": true,
                        "TuesdayValid": true,
                        "WednesdayValid": true,
                        "ThursdayValid": true,
                        "FridayValid": true,
                        "SaturdayValid": false,
                        "SundayValid": false,
                        "StartTime": "23:00",
                        "EndTime": "23:35"
                    }
                  ],
                  "WeeklySpotDistributions": [
                    {
                        "SpotPerWeekQuantity": "10",
                        "MondayValid": true,
                        "TuesdayValid": true,
                        "WednesdayValid": true,
                        "ThursdayValid": true,
                        "FridayValid": true,
                        "SaturdayValid": false,
                        "SundayValid": false,
                        "StartDate": "2007-03-26T00:00:00",
                        "EndDate": "2007-04-15T00:00:00"
                    },
                    {
                        "SpotPerWeekQuantity": "10",
                        "MondayValid": true,
                        "TuesdayValid": true,
                        "WednesdayValid": true,
                        "ThursdayValid": true,
                        "FridayValid": true,
                        "SaturdayValid": false,
                        "SundayValid": false,
                        "StartDate": "2007-04-23T00:00:00",
                        "EndDate": "2007-04-29T00:00:00"
                    }
                  ],
                  "DailySpotDistributions": [],
                  "SpotOptions": [
                    {
                        "Key": "ProgramPodPosition",
                        "Value": "First"
                    }
                  ],
                  "TargetDemoValue": [
                    {
                        "RatingPointValue": 1.2,
                        "ImpressionsValue": null,
                        "DemoId": "DM0"
                    }
                  ],
                  "BuylineIdReferences": [
                    {
                        "source": "Agency",
                        "sourceDescription": null,
                        "Value": "1"
                    }
                  ],
                  "BuylineCashTrade": "Cash",
                  "BuylineDescription": "Late News",
                  "StartDate": "2007-03-26T00:00:00",
                  "EndDate": "2007-04-29T00:00:00",
                  "BuylineQuantity": {
                      "unitType": "Spot",
                      "Value": "40"
                  },
                  "BuylineUnitRate": {
                      "Value": 150.00,
                      "CostModel": "Unit"
                  },
                  "BuylineGrossAmount": 6000.00,
                  "Comment": [
                    {
                        "source": "Agency",
                        "sourceDescription": null,
                        "Value": "TSpots must air in first break.."
                    }
                  ],
                  "CancelDate": null,
                  "BuylineNumber": 2,
                  "BuylineVersion": 1,
                  "BuylineStatus": "New"
              }
            ],
            "InteractiveBuylines": [
              {
                  "BuylineIdReferences": [
                    {
                        "source": "Agency",
                        "sourceDescription": null,
                        "Value": "2"
                    }
                  ],
                  "BuylineCashTrade": "Cash",
                  "BuylineDescription": "www.waaa.com/business banner",
                  "StartDate": "2007-04-09T00:00:00",
                  "EndDate": "2007-04-29T00:00:00",
                  "BuylineQuantity": {
                      "unitType": "Impression",
                      "Value": "1000"
                  },
                  "BuylineUnitRate": {
                      "Value": 2.00,
                      "CostModel": null
                  },
                  "BuylineGrossAmount": 2000.00,
                  "Comment": [
                    {
                        "source": "Agency",
                        "sourceDescription": null,
                        "Value": "Al's Comment"
                    }
                  ],
                  "CancelDate": null,
                  "BuylineNumber": 3,
                  "BuylineVersion": 1,
                  "BuylineStatus": "New"
              }
            ],
            "NonAirtimeBuylines": [
              {
                  "BuylineIdReferences": [
                    {
                        "source": "Agency",
                        "sourceDescription": null,
                        "Value": "3"
                    }
                  ],
                  "BuylineDescription": "Promotional appearance by WAAA on-air staff",
                  "BuylineCashTrade": "Cash",
                  "NonAirtimeCategory": "TalentFee",
                  "Quantity": null,
                  "NonAirtimeGrossAmount": 1000.00,
                  "buylineNumber": "4",
                  "buylineVersion": "1",
                  "buylineStatus": "New"
              }
            ]
        }

        var _advertisers = [
            {
                "CompanyName": "Acme Widget, Inc.",
                "Addresses": [
                  {
                      "AddressBlockLine": null,
                      "City": "AnyTown",
                      "CountryCode": "USA",
                      "PostalCode": "11111-2222",
                      "RegionCode": "NY",
                      "Street1": "15 Oak St. Suite 1300",
                      "Street2": null,
                      "Street3": null,
                      "AddressRole": "Business"
                  }
                ],
                "Contacts": [
                  {
                      "PersonPrefix": "Mr.",
                      "PersonFirstName": "Robert",
                      "PersonMiddleInitial": null,
                      "PersonLastName": "Washington",
                      "PersonSuffix": null,
                      "PersonTitle": "VP MArketing",
                      "Email": [
                        "acustomer@example.com"
                      ],
                      "Phone": [
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551212",
                            "PhoneExtension": null,
                            "phoneLocation": "Office",
                            "phoneType": "Voice"
                        }
                      ],
                      "SourceCode": [
                        {
                            "source": "Agency",
                            "sourceDescription": null,
                            "Value": "AGY_CON_001"
                        }
                      ],
                      "ContactId": "PS0",
                      "ContactRole": "Buyer"
                  }
                ],
                "SourceCodes": [
                  {
                      "source": "Agency",
                      "sourceDescription": null,
                      "Value": "ADV_001"
                  }
                ],
                "DUNSNumber": 101010101
            },
            {
                "CompanyName": "20th Century Fox, Inc.",
                "Addresses": [
                  {
                      "AddressBlockLine": null,
                      "City": "AnyTown",
                      "CountryCode": "USA",
                      "PostalCode": "11111-2222",
                      "RegionCode": "NY",
                      "Street1": "15 Oak St. Suite 1300",
                      "Street2": null,
                      "Street3": null,
                      "AddressRole": "Business"
                  }
                ],
                "Contacts": [
                  {
                      "PersonPrefix": "Mr.",
                      "PersonFirstName": "Robert",
                      "PersonMiddleInitial": null,
                      "PersonLastName": "Washington",
                      "PersonSuffix": null,
                      "PersonTitle": "VP MArketing",
                      "Email": [
                        "acustomer@example.com"
                      ],
                      "Phone": [
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551212",
                            "PhoneExtension": null,
                            "phoneLocation": "Office",
                            "phoneType": "Voice"
                        }
                      ],
                      "SourceCode": [
                        {
                            "source": "Agency",
                            "sourceDescription": null,
                            "Value": "AGY_CON_001"
                        }
                      ],
                      "ContactId": "PS0",
                      "ContactRole": "Buyer"
                  }
                ],
                "SourceCodes": [
                  {
                      "source": "Agency",
                      "sourceDescription": null,
                      "Value": "ADV_001"
                  }
                ],
                "DUNSNumber": 101010101
            },
            {
                "CompanyName": "20th Century Fox, Inc.",
                "Addresses": [
                  {
                      "AddressBlockLine": null,
                      "City": "AnyTown",
                      "CountryCode": "USA",
                      "PostalCode": "11111-2222",
                      "RegionCode": "NY",
                      "Street1": "15 Oak St. Suite 1300",
                      "Street2": null,
                      "Street3": null,
                      "AddressRole": "Business"
                  }
                ],
                "Contacts": [
                  {
                      "PersonPrefix": "Mr.",
                      "PersonFirstName": "Robert",
                      "PersonMiddleInitial": null,
                      "PersonLastName": "Washington",
                      "PersonSuffix": null,
                      "PersonTitle": "VP MArketing",
                      "Email": [
                        "acustomer@example.com"
                      ],
                      "Phone": [
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551212",
                            "PhoneExtension": null,
                            "phoneLocation": "Office",
                            "phoneType": "Voice"
                        }
                      ],
                      "SourceCode": [
                        {
                            "source": "Agency",
                            "sourceDescription": null,
                            "Value": "AGY_CON_001"
                        }
                      ],
                      "ContactId": "PS0",
                      "ContactRole": "Buyer"
                  }
                ],
                "SourceCodes": [
                  {
                      "source": "Agency",
                      "sourceDescription": null,
                      "Value": "ADV_001"
                  }
                ],
                "DUNSNumber": 101010101
            }
        ]

        var _agencies = [
            {
                "Office": {
                    "OfficeName": "New York Sales",
                    "Phone": [
                      {
                          "CountryAccessCode": "1",
                          "AreaCityCode": "212",
                          "PhoneNumber": "5551000",
                          "PhoneExtension": null,
                          "phoneLocation": "Office",
                          "phoneType": "Voice"
                      }
                    ],
                    "Addresses": [
                      {
                          "AddressBlockLine": null,
                          "City": "New York",
                          "CountryCode": "USA",
                          "PostalCode": "10174-1801",
                          "RegionCode": "NY",
                          "Street1": "405 Lexington Ave 18th Fl",
                          "Street2": null,
                          "Street3": null,
                          "AddressRole": "Billing"
                      }
                    ],
                    "SourceCode": [
                      {
                          "source": "Agency",
                          "sourceDescription": null,
                          "Value": "AGY_OFF_001"
                      }
                    ],
                    "LocationCode": "101"
                },
                "TradingPartnerId": null,
                "CompanyName": "AAAA Advertising Agency, Inc.",
                "Addresses": [
                  {
                      "AddressBlockLine": null,
                      "City": "New York",
                      "CountryCode": "USA",
                      "PostalCode": "10174-1801",
                      "RegionCode": "NY",
                      "Street1": "405 Lexington Ave 18th Fl",
                      "Street2": null,
                      "Street3": null,
                      "AddressRole": "Billing"
                  }
                ],
                "Contacts": [
                  {
                      "PersonPrefix": "Ms.",
                      "PersonFirstName": "Jane",
                      "PersonMiddleInitial": null,
                      "PersonLastName": "Doe",
                      "PersonSuffix": null,
                      "PersonTitle": "Buyer",
                      "Email": [
                        "jdoe@aaaa.org"
                      ],
                      "Phone": [
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551212",
                            "PhoneExtension": "333",
                            "phoneLocation": "Office",
                            "phoneType": "Voice"
                        },
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551213",
                            "PhoneExtension": null,
                            "phoneLocation": "Office",
                            "phoneType": "Fax"
                        }
                      ],
                      "SourceCode": [
                        {
                            "source": "Agency",
                            "sourceDescription": null,
                            "Value": "AGY_CON_002"
                        }
                      ],
                      "ContactId": "PS1",
                      "ContactRole": "Buyer"
                  }
                ],
                "SourceCodes": [
                  {
                      "source": "Agency",
                      "sourceDescription": null,
                      "Value": "AGY_AGY_001"
                  }
                ],
                "DUNSNumber": 202020202
            },
            {
                "Office": {
                    "OfficeName": "Direct Client Sales",
                    "Phone": [
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551000",
                            "PhoneExtension": null,
                            "phoneLocation": "Office",
                            "phoneType": "Voice"
                        }
                    ],
                    "Addresses": [
                        {
                            "AddressBlockLine": null,
                            "City": "New York",
                            "CountryCode": "USA",
                            "PostalCode": "10174-1801",
                            "RegionCode": "NY",
                            "Street1": "405 Lexington Ave 18th Fl",
                            "Street2": null,
                            "Street3": null,
                            "AddressRole": "Billing"
                        }
                    ],
                    "SourceCode": [
                        {
                            "source": "Agency",
                            "sourceDescription": null,
                            "Value": "AGY_OFF_001"
                        }
                    ],
                    "LocationCode": "101"
                },
                "TradingPartnerId": null,
                "CompanyName": "AAAA Advertising Agency, Inc.",
                "Addresses": [
                    {
                        "AddressBlockLine": null,
                        "City": "New York",
                        "CountryCode": "USA",
                        "PostalCode": "10174-1801",
                        "RegionCode": "NY",
                        "Street1": "405 Lexington Ave 18th Fl",
                        "Street2": null,
                        "Street3": null,
                        "AddressRole": "Billing"
                    }
                ],
                "Contacts": [
                    {
                        "PersonPrefix": "Ms.",
                        "PersonFirstName": "Jane",
                        "PersonMiddleInitial": null,
                        "PersonLastName": "Doe",
                        "PersonSuffix": null,
                        "PersonTitle": "Buyer",
                        "Email": [
                        "jdoe@aaaa.org"
                        ],
                        "Phone": [
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551212",
                            "PhoneExtension": "333",
                            "phoneLocation": "Office",
                            "phoneType": "Voice"
                        },
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551213",
                            "PhoneExtension": null,
                            "phoneLocation": "Office",
                            "phoneType": "Fax"
                        }
                        ],
                        "SourceCode": [
                        {
                            "source": "Agency",
                            "sourceDescription": null,
                            "Value": "AGY_CON_002"
                        }
                        ],
                        "ContactId": "PS1",
                        "ContactRole": "Buyer"
                    }
                ],
                "SourceCodes": [
                    {
                        "source": "Agency",
                        "sourceDescription": null,
                        "Value": "AGY_AGY_001"
                    }
                ],
                "DUNSNumber": 202020202
            },
            {
                "Office": {
                    "OfficeName": "Media Direct",
                    "Phone": [
                      {
                          "CountryAccessCode": "1",
                          "AreaCityCode": "212",
                          "PhoneNumber": "5551000",
                          "PhoneExtension": null,
                          "phoneLocation": "Office",
                          "phoneType": "Voice"
                      }
                    ],
                    "Addresses": [
                      {
                          "AddressBlockLine": null,
                          "City": "New York",
                          "CountryCode": "USA",
                          "PostalCode": "10174-1801",
                          "RegionCode": "NY",
                          "Street1": "405 Lexington Ave 18th Fl",
                          "Street2": null,
                          "Street3": null,
                          "AddressRole": "Billing"
                      }
                    ],
                    "SourceCode": [
                      {
                          "source": "Agency",
                          "sourceDescription": null,
                          "Value": "AGY_OFF_001"
                      }
                    ],
                    "LocationCode": "101"
                },
                "TradingPartnerId": null,
                "CompanyName": "AAAA Advertising Agency, Inc.",
                "Addresses": [
                  {
                      "AddressBlockLine": null,
                      "City": "New York",
                      "CountryCode": "USA",
                      "PostalCode": "10174-1801",
                      "RegionCode": "NY",
                      "Street1": "405 Lexington Ave 18th Fl",
                      "Street2": null,
                      "Street3": null,
                      "AddressRole": "Billing"
                  }
                ],
                "Contacts": [
                  {
                      "PersonPrefix": "Ms.",
                      "PersonFirstName": "Jane",
                      "PersonMiddleInitial": null,
                      "PersonLastName": "Doe",
                      "PersonSuffix": null,
                      "PersonTitle": "Buyer",
                      "Email": [
                        "jdoe@aaaa.org"
                      ],
                      "Phone": [
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551212",
                            "PhoneExtension": "333",
                            "phoneLocation": "Office",
                            "phoneType": "Voice"
                        },
                        {
                            "CountryAccessCode": "1",
                            "AreaCityCode": "212",
                            "PhoneNumber": "5551213",
                            "PhoneExtension": null,
                            "phoneLocation": "Office",
                            "phoneType": "Fax"
                        }
                      ],
                      "SourceCode": [
                        {
                            "source": "Agency",
                            "sourceDescription": null,
                            "Value": "AGY_CON_002"
                        }
                      ],
                      "ContactId": "PS1",
                      "ContactRole": "Buyer"
                  }
                ],
                "SourceCodes": [
                  {
                      "source": "Agency",
                      "sourceDescription": null,
                      "Value": "AGY_AGY_001"
                  }
                ],
                "DUNSNumber": 202020202
            },
        ]

        // begin REF lists
        var _lstCashTrade = [
        { "value": "Cash" },
        { "value": "Mix" },
        { "value": "Trade" }
        ];
        var _lstOrderTypes = [
        { "value": "Normal" },
        { "value": "Paid" },
        { "value": "Political" },
        { "value": "Promo" },
        { "value": "PSA" }
        ];
        var _lstBusinessTypes = [
        { "value": "Local" },
        { "value": "National" }
        ];
        // end REF lists

        exports.getNewOrder = _getNewOrder;
        exports.findAccountExecutives = _findAccountExecutives;
        exports.findProducts = _findProducts;
        exports.findSellers = _findSellers;
        exports.findStation = _findStation;
        exports.findAdvertisers = _findAdvertisers;
        exports.findAgencies = _findAgencies;

        exports.getActiveOrders = _getActiveOrders;
        exports.testOrder = _order;
        exports.testAgencies = _agencies;
        exports.lstCashTrade = _lstCashTrade;
        exports.lstOrderTypes = _lstOrderTypes;
        exports.lstBusinessTypes = _lstBusinessTypes;

        return exports;

    }

})();