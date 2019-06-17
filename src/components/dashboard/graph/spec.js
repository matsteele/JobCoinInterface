import React from 'react'
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Dashboard from './index'
import { findByTestAttr } from 'utils/tests'
import { sumToDate } from 'utils/helper_functions'

configure({ adapter: new Adapter() });

const setup = (props = {}) => {
    const component = mount(<Dashboard {...props} />, {context:context});
    component.setContext(context);
    component.context = context
    return component
}

const transactions = [{ timestamp: "2019-06-05T19:55:04.233Z", toAddress: "Alice", amount: "50" }
,{ timestamp: "2019-06-05T19:55:04.241Z", fromAddress: "Alice", toAddress: "Bob", amount: "12.5" }
,{ timestamp: "2019-06-05T22:09:50.721Z", toAddress: "testaddress", amount: "50" }
,{ timestamp: "2019-06-05T22:10:14.402Z", fromAddress: "Alice", toAddress: "Bob", amount: "5" }
,{ timestamp: "2019-06-05T22:10:34.313Z", toAddress: "Bob", amount: "50" }
,{ timestamp: "2019-06-06T16:07:21.198Z", toAddress: "John", amount: "50" }
,{ timestamp: "2019-06-06T16:07:27.246Z", toAddress: "Mat", amount: "50" }]


describe('Dashboard Component tests', () => {

    describe('transaction data computes for graph', () => {
        let component;
        beforeEach(() => {
            component = setup()
        })
        it('helper function outputs total balance based on transactions by date', () => {
            const expectedAliceSum = 50 - 12.5 - 5
            const DateToCompare = Date.parse("2019-06-06T16:07:21.198Z")
            expect(typeof DateToCompare).toBe('number')
            const sumToDateByAlice = sumToDate(DateToCompare, "Alice", transactions)
            expect(sumToDateByAlice).toBe(expectedAliceSum)
        });
        it('current balance text is shown in balance element', () => {
            console.log(context, 'context')
            const currentTime = '2019-06-11T03:41:11.343Z'
            const currentBalance = sumToDate(
                currentTime,
                context.currentUser,
                context.transactions
            );
            const balanceDiv = findByTestAttr(component, 'balanceDiv')
            expect(balanceDiv.text()).toBe(currentBalance);
        });
    });

})



const context = {
    allUsers: ["Alice", "Bob", "testaddress", "John", "Mat", "Matt", "Justin"],
currentUser: "Alice",
transactions: [{ timestamp: "2019-06-05T19:55:04.233Z", toAddress: "Alice", amount: "50" }
,{ timestamp: "2019-06-05T19:55:04.241Z", fromAddress: "Alice", toAddress: "Bob", amount: "12.5" }
,{ timestamp: "2019-06-05T22:09:50.721Z", toAddress: "testaddress", amount: "50" }
,{ timestamp: "2019-06-05T22:10:14.402Z", fromAddress: "Alice", toAddress: "Bob", amount: "5" }
,{timestamp: "2019-06-05T22:10:34.313Z", toAddress: "Bob", amount: "50" }
,{timestamp: "2019-06-06T16:07:21.198Z", toAddress: "John", amount: "50" }
,{timestamp: "2019-06-06T16:07:27.246Z", toAddress: "Mat", amount: "50" }
,{timestamp: "2019-06-06T16:07:38.979Z", fromAddress: "Mat", toAddress: "John", amount: "23" }
,{timestamp: "2019-06-06T16:09:02.450Z", fromAddress: "Alice", toAddress: "Mat", amount: "10" }
,{timestamp: "2019-06-06T16:09:23.637Z", fromAddress: "John", toAddress: "Mat", amount: "10" }
,{timestamp: "2019-06-06T16:46:06.954Z", fromAddress: "Bob", toAddress: "John", amount: "5" }
,{timestamp: "2019-06-06T16:46:15.883Z", fromAddress: "John", toAddress: "Alice", amount: "4" }
,{timestamp: "2019-06-07T14:31:09.193Z", fromAddress: "Bob", toAddress: "Matt", amount: "20" }
,{timestamp: "2019-06-07T14:31:30.168Z", fromAddress: "John", toAddress: "Alice", amount: "10" }
,{timestamp: "2019-06-07T14:31:40.794Z", fromAddress: "Bob", toAddress: "Mat", amount: "10" }
,{timestamp: "2019-06-07T14:31:59.233Z", fromAddress: "Matt", toAddress: "John", amount: "12" }
,{timestamp: "2019-06-07T14:32:18.510Z", fromAddress: "Alice", toAddress: "Matt", amount: "5" }
,{timestamp: "2019-06-09T14:54:40.792Z", fromAddress: "Mat", toAddress: "Alice", amount: "3" }
,{timestamp: "2019-06-09T14:54:50.125Z", fromAddress: "Bob", toAddress: "John", amount: "10" }
,{timestamp: "2019-06-09T14:54:59.417Z", fromAddress: "Matt", toAddress: "Alice", amount: "12" }
,{timestamp: "2019-06-09T14:55:15.684Z", fromAddress: "John", toAddress: "Bob", amount: "10" }
,{timestamp: "2019-06-09T15:03:45.745Z", fromAddress: "Mat", toAddress: "Justin", amount: "20" }
,{timestamp: "2019-06-09T15:03:55.224Z", fromAddress: "Justin", toAddress: "John", amount: "3" }
,{timestamp: "2019-06-10T05:37:47.744Z", toAddress: "Alice", amount: "50" }
,{timestamp: "2019-06-10T05:37:57.838Z", fromAddress: "Alice", toAddress: "Bob", amount: "20" }
,{timestamp: "2019-06-10T05:38:07.496Z", fromAddress: "Bob", toAddress: "John", amount: "10" }
,{timestamp: "2019-06-10T05:38:14.028Z", fromAddress: "John", toAddress: "Justin", amount: "20" }
,{timestamp: "2019-06-10T05:38:21.762Z", fromAddress: "Justin", toAddress: "Mat", amount: "5" }
,{timestamp: "2019-06-10T05:38:33.289Z", fromAddress: "Mat", toAddress: "Matt", amount: "10" }
,{timestamp: "2019-06-10T16:11:27.107Z", toAddress: "Alice", amount: "50" }
,{timestamp: "2019-06-10T16:11:42.029Z", fromAddress: "Alice", toAddress: "Bob", amount: "40" }
,{timestamp: "2019-06-10T16:11:49.938Z", fromAddress: "Bob", toAddress: "John", amount: "30" }
,{timestamp: "2019-06-10T16:12:01.906Z", fromAddress: "Alice", toAddress: "Justin", amount: "20" }
,{timestamp: "2019-06-10T16:12:11.741Z", fromAddress: "Justin", toAddress: "Mat", amount: "10" }
,{timestamp: "2019-06-10T16:12:20.345Z", fromAddress: "Mat", toAddress: "Matt", amount: "6" }
,{timestamp: "2019-06-11T03:40:39.651Z", toAddress: "Bob", amount: "50" }
,{timestamp: "2019-06-11T03:40:48.223Z", fromAddress: "Bob", toAddress: "Justin", amount: "20" }
,{timestamp: "2019-06-11T03:40:57.284Z", fromAddress: "Justin", toAddress: "Mat", amount: "10" }
,{timestamp: "2019-06-11T03:41:11.343Z", fromAddress: "John", toAddress: "Matt", amount: "5" }]
}
