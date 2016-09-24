package com.friendathlon.neura;

import android.os.Bundle;
import android.os.Message;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;

import com.neura.resources.authentication.AuthenticateCallback;
import com.neura.resources.authentication.AuthenticateData;
import com.neura.sdk.object.AuthenticationRequest;
import com.neura.sdk.object.Permission;
import com.neura.sdk.service.SubscriptionRequestCallbacks;
import com.neura.standalonesdk.service.NeuraApiClient;
import com.neura.standalonesdk.util.Builder;
import com.neura.standalonesdk.util.SDKUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;


public class NeuraModule extends ReactContextBaseJavaModule {
  private NeuraApiClient mNeuraApiClient;
  private ArrayList<Permission> mPermissions;

  private Callback success;
  private Callback error;
  private Callback logOutCallback;

  //private static final String DURATION_SHORT_KEY = "SHORT";
  //private static final String DURATION_LONG_KEY = "LONG";

  public NeuraModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "Neura";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    //constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    //constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void logIn(ReadableArray perms, Callback successCallback, Callback errorCallback) {
    Builder builder = new Builder(getReactApplicationContext());
    mNeuraApiClient = builder.build();
    mNeuraApiClient.setAppUid("256c65c4b816b03f3e8d0ea090bdf03895ed20c3a252ee436b385757c439093c");
    mNeuraApiClient.setAppSecret("6eafe10ec859b3dea7c9e7702fa6ddb7e7110f16f9094c71df5087eeceae9c5f");
    mNeuraApiClient.connect();

    success = successCallback;
    error = errorCallback;

    String[] permsArr = new String[perms.size()];

    for (int i = 0; i < perms.size(); i++) {
      permsArr[i] = perms.getString(i);
    }

    mPermissions = Permission.list(permsArr);

    AuthenticationRequest request = new AuthenticationRequest(mPermissions);

    mNeuraApiClient.authenticate(request, new AuthenticateCallback() {
        @Override
        public void onSuccess(AuthenticateData authenticateData) {
            success.invoke(authenticateData.getNeuraUserId(), authenticateData.getAccessToken());
        }

        @Override
        public void onFailure(int i) {
          error.invoke(SDKUtils.errorCodeToString(i));
        }
    });
  }

  @ReactMethod
  public void subscribe(String eventName) {
    Builder builder = new Builder(getReactApplicationContext());
    mNeuraApiClient = builder.build();
    mNeuraApiClient.setAppUid("256c65c4b816b03f3e8d0ea090bdf03895ed20c3a252ee436b385757c439093c");
    mNeuraApiClient.setAppSecret("6eafe10ec859b3dea7c9e7702fa6ddb7e7110f16f9094c71df5087eeceae9c5f");
    mNeuraApiClient.connect();

    mNeuraApiClient.subscribeToEvent(eventName, eventName, false, null);
  }

  @ReactMethod
  public void logOut(Callback callback) {
    Builder builder = new Builder(getReactApplicationContext());
    mNeuraApiClient = builder.build();
    mNeuraApiClient.setAppUid("256c65c4b816b03f3e8d0ea090bdf03895ed20c3a252ee436b385757c439093c");
    mNeuraApiClient.setAppSecret("6eafe10ec859b3dea7c9e7702fa6ddb7e7110f16f9094c71df5087eeceae9c5f");
    mNeuraApiClient.connect();

    logOutCallback = callback;

    mNeuraApiClient.forgetMe(null, false, new android.os.Handler.Callback() {
        @Override
        public boolean handleMessage(Message msg) {
            logOutCallback.invoke(true);
            return true;
        }
    });
  }
}
