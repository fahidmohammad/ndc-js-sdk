'use strict';

var should = require('should'),
    testData = require('./test-data'),
    NDC = require('../');

// Override API Key with env variable
if (process.env.API_KEY) {
    testData.config[0].APIAuthKey = testData.config[1].APIAuthKey = process.env.API_KEY;
}

var ndc = new NDC(testData.config[0]);

describe('NDC client', function () {
    describe('Shopping messages', function () {
        describe('should handle AirShopping messages', function () {
            it('should create "one flight" XML messages with only one <OriginDestination> element', function (done) {
                var xml = ndc.messages.AirShopping(testData.AirShopping[0]).toXML(true, true);
                should(xml.match(/<OriginDestination>/g).length).equal(1);
                done();
            });
            it('should create "round trip" XML messages with two <OriginDestination> elements', function (done) {
                var xml = ndc.messages.AirShopping(testData.AirShopping[1]).toXML(true, true);
                should(xml.match(/<OriginDestination>/g).length).equal(2);
                done();
            });
            it('should receive a successful response with a "ShoppingResponseIDs" element', function (done) {
                ndc.messages.AirShopping(testData.AirShopping[1]).request(function (err, data) {
                    should.not.exist(err);
                    should.exist(data.AirShoppingRS.Success);
                    should.exist(data.AirShoppingRS.ShoppingResponseIDs);
                    done();
                });
            });
        });
        describe('should handle FlightPrice messages', function () {
            it('should receive a successful response with "PricedFlightOffers" element', function (done) {
                ndc.messages.FlightPrice(testData.FlightPrice[0]).request(function (err, data) {
                    should.not.exist(err);
                    should.exist(data.FlightPriceRS.Success);
                    should.exist(data.FlightPriceRS.ShoppingResponseIDs);
                    should.exist(data.FlightPriceRS.PricedFlightOffers);
                    done();
                });
            });
        });
        describe('should handle SeatAvailability messages', function () {
            it('should receive a successful response with "Flights" and "DataLists" elements', function (done) {
                ndc.messages.SeatAvailability(testData.SeatAvailability[0]).request(function (err, data) {
                    should.not.exist(err);
                    should.exist(data.SeatAvailabilityRS.Success);
                    should.exist(data.SeatAvailabilityRS.Flights);
                    should.exist(data.SeatAvailabilityRS.DataLists);
                    done();
                });
            });
        });
        describe('should handle ServiceList messages', function () {
            it('should receive a successful response with a "DataLists" element', function (done) {
                ndc.messages.ServiceList(testData.ServiceList[0]).request(function (err, data) {
                    should.not.exist(err);
                    should.exist(data.ServiceListRS.Success);
                    should.exist(data.ServiceListRS.DataLists);
                    done();
                });
            });
        });
        describe('should handle ServicePrice messages', function () {
            it('should receive a successful response with a "DataLists" element', function (done) {
                ndc.messages.ServicePrice(testData.ServicePrice[0]).request(function (err, data) {
                    should.not.exist(err);
                    should.exist(data.ServicePriceRS.Success);
                    should.exist(data.ServicePriceRS.DataLists);
                    done();
                });
            });
        });
    });
    describe('Order management messages', function () {
        var orderID;
        describe('should handle OrderCreate messages', function () {
            it('should receive a successful "OrderViewRS" response element', function (done) {
                ndc.messages.OrderCreate(testData.OrderCreate[0]).request(function (err, data) {
                    should.not.exist(err);
                    should.exist(data.OrderViewRS.Success);
                    orderID = data.OrderViewRS.Response.Order.OrderID._;
                    done();
                });
            });
        });
        describe('should handle OrderList messages', function () {
            it('should receive a successful "OrderListRS" response element', function (done) {
                ndc.messages.OrderList(testData.OrderList[0]).request(function (err, data) {
                    should.not.exist(err);
                    should.exist(data.OrderListRS.Success);
                    done();
                });

            });
        });
        describe('should handle OrderRetrieve messages', function () {
            it('should receive a successful "OrderViewRS" response element', function (done) {
                var reqData = testData.OrderRetrieve[0];
                reqData.order.id = orderID;
                ndc.messages.OrderRetrieve(reqData).request(function (err, data) {
                    should.not.exist(err);
                    should.exist(data.OrderViewRS.Success);
                    done();
                });
            });
        });
        describe('should handle OrderCancel messages', function () {
            it('should receive a successful "OrderCancelRS" response element', function (done) {
                var reqData = testData.OrderCancel[0];
                reqData.order.id = orderID;
                ndc.messages.OrderCancel(reqData).request(function (err, data) {
                    should.not.exist(err);
                    should.exist(data.OrderCancelRS.Success);
                    done();
                });
            });
        });
        describe('should handle ItinReshop messages', function () {
            it('pending tests...');
        });

    });
});
